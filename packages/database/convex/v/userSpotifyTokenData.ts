import { v } from 'convex/values';
import { Id } from '../_generated/dataModel.js';
import {
	mutation,
	query,
} from '../_generated/server.js';

export const get = query({
	args: {
		from: v.object({
			user: v.union(v.id('User'), v.object({ username: v.string() })),
		}),
	},
	async handler(ctx, { from: { user } }) {
		let userId: Id<'User'>;
		if (typeof user === 'string') {
			userId = user;
		} else {
			userId = (await ctx.db.query('User').withIndex(
				'by_username',
				(q) => q.eq('username', user.username),
			).unique())!._id;
		}

		return ctx.db.query('UserSpotifyTokenData').withIndex(
			'by_user',
			(q) => q.eq('user', userId),
		).unique();
	},
});

export const upsert = mutation({
	args: {
		data: v.object({
			user: v.id('User'),
			accessToken: v.string(),
			refreshToken: v.string(),
			expirationUnixTimestamp: v.number(),
		}),
	},
	async handler(ctx, { data }) {
		const existingTokenData = await ctx.db.query('UserSpotifyTokenData')
			.withIndex(
				'by_user',
				(q) => q.eq('user', data.user),
			).unique();
		if (existingTokenData === null) {
			return ctx.db.insert('UserSpotifyTokenData', data);
		} else {
			ctx.db.patch(existingTokenData._id, data);
			return existingTokenData;
		}
	},
});
