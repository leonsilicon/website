<script setup lang="ts">
import cx from "clsx";
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
							<div class="font-medium">Recharge ⚡</div>
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
			<!-- Hides the artist + song name -->
			<div
				class="absolute bg-white top-0 left-0 right-0 bottom-[10px] -z-10"
			></div>
			<!-- Hides the cover image -->
			<div
				:class="
					cx(
						'absolute bg-white top-0 left-[-2px] -bottom-[0.88rem] -z-10',
						data ? 'w-[90px]' : 'w-[7rem]',
					)
				"
			></div>
			<img
				:class="
					cx(
						'absolute -z-20 w-[320px] h-[40px] -bottom-[5px]',
						data ? 'left-[-8px]' : 'left-[92px]',
					)
				"
				src="https://spotify-github-profile.vercel.app/api/view?uid=31m2rvl5monwbxr7ubbsjkucybcy&cover_image=true&theme=novatorem&show_offline=false&background_color=121212&interchange=false&bar_color=53b14f&bar_color_cover=true"
			/>
			<a
				:class="
					cx(
						'absolute bottom-0 w-[200px] h-[5px] z-10',
						data ? 'left-[92px]' : 'left-[7.25rem]',
					)
				"
				href="https://spotify-github-profile.vercel.app/api/view?uid=31m2rvl5monwbxr7ubbsjkucybcy&redirect=true"
			></a>
		</div>
	</div>
</template>
