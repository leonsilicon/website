<script setup lang="ts">
import type { TodayData } from "#types/today.ts";
import { DateTime } from "luxon";
import { format } from "date-fns";
import queryString from "query-string";

const route = useRoute();
const { data } = await useFetch<TodayData>(
	`/api/today?${queryString.stringify(route.query)}`,
);
</script>

<template>
	<div class="flex h-full items-center justify-center">
		<div
			class="flex flex-col gap-2 border rounded-md p-2 border-gray-700 w-96 min-w-96"
		>
			<div class="flex flex-row gap-2 items-center">
				<NuxtImg
					src="/headshot.jpg"
					width="100"
					height="100"
					class="rounded-full"
				/>
				<div class="flex flex-col gap-2">
					<span class="text-xl leading-none font-bold">Leon Si</span>
					<span class="leading-5">
						delusional hacker-entrepreneur, co-founder of
						<a href="https://tunnel.dev" class="underline">tunnel.dev</a> (neo
						'23)
					</span>
					<div class="flex flex-row gap-2">
						<a class="flex" href="https://github.com/leondreamed">
							<Icon name="simple-icons:github" />
						</a>
						<a class="flex" href="https://linkedin.com/in/leondreamed">
							<Icon name="simple-icons:linkedin" />
						</a>
						<a class="flex" href="https://devpost.com/leondreamed">
							<Icon name="simple-icons:devpost" />
						</a>
					</div>
				</div>
			</div>
			<div v-if="data" class="flex flex-col items-center">
				<span class="font-bold mr-1">Today</span>
				<span class="text-[0.6rem] text-gray-700 mb-2">{{
					format(new Date(), "MMMM do, yyyy")
				}}</span>
				<div class="flex flex-col gap-1 text-xs">
					<div class="grid grid-cols-[auto,auto] gap-x-3 gap-y-1">
						<div class="flex items-center font-mono">
							{{ data.yesterdayBedtime }} -
							<template v-if="data.todayWakeup !== null">{{
								data.todayWakeup
							}}</template>
							<Icon v-else name="f7:zzz" class="ml-1.5" />
						</div>
						<div class="font-medium">Recharging ⚡</div>
						<template v-for="timeEntry of data.timeEntries">
							<div class="font-mono">
								{{
									DateTime.fromSeconds(
										timeEntry.atUnixTimestamp,
									).toLocaleString(DateTime.TIME_24_SIMPLE)
								}}
								-
								<template v-if="timeEntry.stopUnixTimestamp !== null">{{
									DateTime.fromSeconds(
										timeEntry.stopUnixTimestamp,
									).toLocaleString(DateTime.TIME_24_SIMPLE)
								}}</template>
								<span class="italic">now</span>
							</div>
							<div class="font-medium">
								{{ timeEntry.description }}
								{{ timeEntry.stopUnixTimestamp === null ? "🚀" : "" }}
							</div>
						</template>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
