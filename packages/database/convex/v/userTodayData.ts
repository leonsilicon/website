import { v } from 'convex/values';
import { vNullable } from 'corvex';
import { protectedMutation } from '../../utils/mutation.ts';
import { protectedQuery } from '../../utils/query.ts';

export const get = protectedQuery({
	args: {
		from: v.object({
			user: v.id('User'),
		}),
	},
	async handler(ctx, { from }) {
		return ctx.db.query('UserTodayData').withIndex(
			'by_user',
			(q) => q.eq('user', from.user),
		).unique();
	},
});

export const upsert = protectedMutation({
	args: {
		data: v.object({
			user: v.id('User'),
			todayWakeup: vNullable(v.string()),
			yesterdayBedtime: vNullable(v.string()),
			timeEntries: v.array(v.object({
				description: v.string(),
				atUnixTimestamp: v.number(),
				stopUnixTimestamp: vNullable(v.number()),
			})),
			lastFetchedUnixTimestamp: v.number(),
		}),
	},
	async handler(ctx, { data }) {
		const userTodayData = await ctx.db.query('UserTodayData').withIndex(
			'by_user',
			(q) => q.eq('user', data.user),
		).first();

		if (userTodayData !== null) {
			return ctx.db.patch(userTodayData._id, data);
		} else {
			return ctx.db.insert('UserTodayData', data);
		}
	},
});
