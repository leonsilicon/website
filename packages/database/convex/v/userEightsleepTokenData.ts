import { v } from 'convex/values';
import { protectedMutation } from '../../utils/mutation.ts';
import { protectedQuery } from '../../utils/query.ts';

export const get = protectedQuery({
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

export const create = protectedMutation({
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
		return ctx.db.insert('UserEightsleepTokenData', data);
	},
});
