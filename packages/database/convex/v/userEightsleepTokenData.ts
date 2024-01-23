import { v } from 'convex/values';
import { internalMutation, internalQuery } from '../_generated/server.js';

export const get = internalQuery({
	args: {
		from: v.object({
			user: v.id('User'),
		}),
	},
	async handler(ctx, { from }) {
		return ctx.db.query('UserEightsleepTokenData').withIndex(
			'by_user',
			(q) => q.eq('user', from.user),
		).unique();
	},
});

export const upsert = internalMutation({
	args: {
		data: v.object({
			user: v.id('User'),
			accessToken: v.string(),
			refreshToken: v.string(),
			userId: v.string(),
			expirationUnixTimestamp: v.number(),
		}),
	},
	async handler(ctx, { data }) {
		const existingTokenData = await ctx.db.query('UserEightsleepTokenData')
			.withIndex(
				'by_user',
				(q) => q.eq('user', data.user),
			).unique();
		if (existingTokenData === null) {
			return ctx.db.insert('UserEightsleepTokenData', data);
		} else {
			ctx.db.patch(existingTokenData._id, data);
			return existingTokenData;
		}
	},
});
