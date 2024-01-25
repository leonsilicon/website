'use node';

import { internal } from '#convex/_generated/api.js';
import { internalAction } from '#convex/_generated/server.js';
import { Eightsleep } from '@-/eightsleep';
import { getEnv } from '@-/env';
import type { GenericActionCtx } from 'convex/server';
import { format } from 'date-fns';
import { DateTime } from 'luxon';
import { ITimeEntry, Toggl } from 'toggl-track';
import { TodayData } from '../../types/today.ts';
import { DataModel, Id } from '../_generated/dataModel.js';

async function getUserTodayData(
	ctx: GenericActionCtx<DataModel>,
	user: Id<'User'>,
): Promise<TodayData | null> {
	const {
		EIGHTSLEEP_EMAIL,
		EIGHTSLEEP_PASSWORD,
		EIGHTSLEEP_CLIENT_ID,
		EIGHTSLEEP_CLIENT_SECRET,
		TOGGL_TRACK_API_TOKEN,
	} = getEnv();

	const eightsleepTokenData = await ctx.runQuery(
		internal.v.userEightsleepTokenData.get,
		{ from: { user } },
	);

	const eightsleep = new Eightsleep(ctx, {
		credentials: {
			clientId: EIGHTSLEEP_CLIENT_ID,
			clientSecret: EIGHTSLEEP_CLIENT_SECRET,
			email: EIGHTSLEEP_EMAIL,
			password: EIGHTSLEEP_PASSWORD,
		},
		tokenData: eightsleepTokenData,
		websiteUser: user,
	});

	const today = DateTime.local().setZone('America/Toronto').toJSDate();

	const todayAggregateData = await eightsleep.getAggregateData({
		date: today,
	});

	const yesterdayBedtime = todayAggregateData.periods[0]?.samples.find((
		sample,
	) => sample.date === format(today, 'yyyy-MM-dd'))?.avg.find((avg) =>
		avg.name === 'bedtime'
	)?.value.replace(/:\d\d$/, '') ?? null;
	const todayWakeup =
		todayAggregateData.periods[0]?.samples.find((sample) =>
			sample.date === format(today, 'yyyy-MM-dd')
		)?.avg.find((avg) => avg.name === 'wakeup')?.value.replace(/:\d\d$/, '') ??
			null;

	if (yesterdayBedtime === null || todayWakeup === null) {
		return null;
	}

	const todayWakeupUnixTimestamp = DateTime.now().set({
		hour: Number.parseInt(todayWakeup.split(':')[0]!),
		minute: Number.parseInt(todayWakeup.split(':')[1]!),
	}).toUnixInteger();

	const toggl = new Toggl({
		auth: {
			token: TOGGL_TRACK_API_TOKEN,
		},
	});

	const allTimeEntries: ITimeEntry[] = await toggl.timeEntry.list({
		since: DateTime.now().setZone('America/Toronto').set({
			hour: 0,
			minute: 0,
			second: 0,
		}).toUnixInteger().toString(),
	});

	const timeEntries = allTimeEntries
		.filter((timeEntry: any) =>
			timeEntry.description.includes('[public') &&
			!timeEntry.server_deleted_at
		)
		.map((timeEntry) => {
			const publicDescription = timeEntry.description.match(
				/\[public:\s*(.*)\]/,
			);
			if (publicDescription !== null) {
				return {
					...timeEntry,
					description: publicDescription[1],
				};
			}

			return {
				...timeEntry,
				description: timeEntry.description.replace(
					'[public]',
					'',
				).trim(),
			};
		})
		.map((timeEntry) => {
			return {
				description: timeEntry.description as string,
				startUnixTimestamp: DateTime.fromISO(timeEntry.start as string)
					.toUnixInteger(),
				stopUnixTimestamp: timeEntry.stop === null ?
					null :
					DateTime.fromISO(timeEntry.stop).toUnixInteger(),
			};
		})
		.filter((timeEntry) =>
			todayWakeupUnixTimestamp < timeEntry.startUnixTimestamp
		)
		.reverse();

	if (timeEntries.length == 0) {
		return null;
	}

	return {
		todayWakeup,
		yesterdayBedtime,
		timeEntries,
		lastFetchedUnixTimestamp: DateTime.now().toUnixInteger(),
	};
}

export const updateFromApis = internalAction({
	args: {},
	async handler(ctx) {
		const userId = await ctx.runMutation(internal.v.user.ensure, {
			username: 'leondreamed',
		});
		const userTodayData = await getUserTodayData(ctx, userId);

		if (userTodayData === null) {
			await ctx.runMutation(internal.v.userTodayData.delete_, {
				where: {
					user: userId,
				},
			});
		} else {
			await ctx.runMutation(internal.v.userTodayData.upsert, {
				data: {
					user: userId,
					...userTodayData,
				},
			});
		}

		return userTodayData;
	},
});
