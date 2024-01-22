import { v } from 'convex/values';
import { table, vDeprecated, vNew, vNullable } from 'corvex';

export const UserTodayData = table(
	'User',
	v.object({
		user: v.id('User'),
		lastFetchedUnixTimestamp: v.number(),
		yesterdayBedtime: vNullable(v.string()),
		todayWakeup: vNullable(v.string()),
		timeEntries: v.array(v.object({
			description: v.string(),
			startUnixTimestamp: vNew(v.number()),
			stopUnixTimestamp: vNullable(v.number()),

			/** @deprecated */
			atUnixTimestamp: vDeprecated<number>('Use `startUnixTimestamp` instead'),
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
