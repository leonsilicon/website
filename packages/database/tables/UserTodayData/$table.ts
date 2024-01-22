import { v } from 'convex/values';
import { table, vNullable } from 'corvex';

export const UserTodayData = table(
	'User',
	v.object({
		user: v.id('User'),
		lastFetchedUnixTimestamp: v.number(),
		yesterdayBedtime: vNullable(v.string()),
		todayWakeup: vNullable(v.string()),
		timeEntries: v.array(v.object({
			description: v.string(),
			atUnixTimestamp: v.number(),
			stopUnixTimestamp: vNullable(v.number()),
		})),
	}),
	(t) => t.index('by_user', ['user']),
)({
	user: {
		foreignTable: 'User',
		hostIndex: 'by_user',
		onDelete: 'Cascade',
	},
});
