<script setup lang="ts">
import { DateTime } from "luxon";
import { format } from "date-fns";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@-/database";

const data = ref();
(async () => {
	const { convexUrl } = useAppConfig();
	const http = new ConvexHttpClient(convexUrl);
	data.value = await http.query(api.v.userTodayData.get, {
		from: {
			user: { username: "leondreamed" },
		},
	});
})();
</script>

<template>
	<div class="flex h-full items-center justify-center">
		<div class="relative">
			<div
				class="flex flex-col gap-2 border rounded-md p-[12px] border-gray-700 w-[392px] min-w-[392px] relative z-10"
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
							<div class="font-medium">Recharged ⚡</div>
							<template v-for="timeEntry of data.timeEntries">
								<div class="font-mono">
									{{
										DateTime.fromSeconds(
											timeEntry.startUnixTimestamp,
										).toLocaleString(DateTime.TIME_24_SIMPLE)
									}}
									-
									<template v-if="timeEntry.stopUnixTimestamp !== null">{{
										DateTime.fromSeconds(
											timeEntry.stopUnixTimestamp,
										).toLocaleString(DateTime.TIME_24_SIMPLE)
									}}</template>
									<span v-else class="italic">now</span>
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
			<MusicBars :hasData="!!data" />
		</div>
	</div>
</template>
