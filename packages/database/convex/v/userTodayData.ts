import { Id } from '#convex/_generated/dataModel.js';
import { internalMutation, query } from '#convex/_generated/server.js';
import { v } from 'convex/values';
import { vNullable } from 'corvex';

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

		return ctx.db.query('UserTodayData').withIndex(
			'by_user',
			(q) => q.eq('user', userId),
		).unique();
	},
});

export const upsert = internalMutation({
	args: {
		data: v.object({
			user: v.id('User'),
			todayWakeup: vNullable(v.string()),
			yesterdayBedtime: vNullable(v.string()),
			timeEntries: v.array(v.object({
				description: v.string(),
				startUnixTimestamp: v.number(),
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

export const delete_ = internalMutation({
	args: {
		where: v.object({ user: v.id('User') }),
	},
	async handler(ctx, { where }) {
		await ctx.db.delete(where.user);
	},
});
