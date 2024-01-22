import type { TodayData } from '#types/today.ts';
import { api, getConvex } from '@-/database';
import { Eightsleep } from '@-/eightsleep';
import { getEnv } from '@-/env';
import { format } from 'date-fns';
import { DateTime } from 'luxon';
import { Toggl } from 'toggl-track';

export default defineEventHandler(async (event) => {
	const {
		EIGHTSLEEP_EMAIL,
		EIGHTSLEEP_PASSWORD,
		EIGHTSLEEP_CLIENT_ID,
		EIGHTSLEEP_CLIENT_SECRET,
		TOGGL_TRACK_API_TOKEN,
		TODAY_SECRET,
	} = getEnv();
	const { secret } = getQuery(event);

	if (secret !== TODAY_SECRET) {
		return null;
	}

	const convex = getConvex();
	const user = await convex.mutation(api.v.user.ensure, {
		username: 'leondreamed',
	});
	let userTodayData: TodayData | null = await convex.query(
		api.v.userTodayData.get,
		{ from: { user } },
	);

	// To prevent getting rate limited, we only re-fetch data at most once every 10 minutes
	if (
		userTodayData === null ||
		DateTime.fromSeconds(userTodayData.lastFetchedUnixTimestamp).diffNow()
				.as('minutes') >
			10
	) {
		const eightsleepTokenData = await convex.query(
			api.v.userEightsleepTokenData.get,
			{ from: { user } },
		);

		const eightsleep = new Eightsleep({
			credentials: {
				clientId: EIGHTSLEEP_CLIENT_ID,
				clientSecret: EIGHTSLEEP_CLIENT_SECRET,
				email: EIGHTSLEEP_EMAIL,
				password: EIGHTSLEEP_PASSWORD,
			},
			tokenData: eightsleepTokenData,
			websiteUser: user,
		});

		const yesterday = DateTime.now().minus({ days: 1 }).toJSDate();
		const today = DateTime.now().toJSDate();

		const yesterdayAggregateData = await eightsleep.getAggregateData({
			date: yesterday,
		});
		const todayAggregateData = await eightsleep.getAggregateData({
			date: today,
		});

		const yesterdayBedtime = yesterdayAggregateData.periods[0].samples.find((
			sample,
		) => sample.date === format(yesterday, 'yyyy-MM-dd'))?.avg.find((avg) =>
			avg.name === 'bedtime'
		)?.value.replace(/:\d\d$/, '') ?? null;
		const todayWakeup = todayAggregateData.periods[0].samples.find((sample) =>
			sample.date === format(today, 'yyyy-MM-dd')
		)?.avg.find((avg) =>
			avg.name === 'wakeup'
		)?.value.replace(/:\d\d$/, '') ?? null;

		const toggl = new Toggl({
			auth: {
				token: TOGGL_TRACK_API_TOKEN,
			},
		});

		const allTimeEntries = await toggl.timeEntry.list({
			since: DateTime.now().setZone('America/Toronto').set({
				hour: 0,
				minute: 0,
				second: 0,
			}).toUnixInteger().toString(),
		});

		const publicTimeEntries = allTimeEntries
			.filter((timeEntry: any) =>
				timeEntry.description.includes('[public')
			)
			.map((timeEntry: any) => {
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
			});

		userTodayData = {
			todayWakeup,
			yesterdayBedtime,
			timeEntries: publicTimeEntries.map((timeEntry: any) => {
				return {
					description: timeEntry.description as string,
					atUnixTimestamp: DateTime.fromISO(timeEntry.at as string)
						.toUnixInteger(),
					stopUnixTimestamp: timeEntry.stop === null ?
						null :
						DateTime.fromRFC2822(timeEntry.stop).toUnixInteger(),
				};
			}),
			lastFetchedUnixTimestamp: DateTime.now().toUnixInteger(),
		};

		await convex.mutation(api.v.userTodayData.upsert, {
			data: {
				user,
				...userTodayData,
			},
		});
	}

	return userTodayData;
});
