<script setup lang="ts">
import cx from "clsx";
import { DateTime } from "luxon";
import { format } from "date-fns";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@-/database";

let data: any;
if (typeof window !== "undefined") {
	const { convexUrl } = useAppConfig();
	const http = new ConvexHttpClient(convexUrl);
	data = await http.query(api.v.userTodayData.get, {
		from: {
			user: { username: "leondreamed" },
		},
	});
} else {
	data = null;
}
</script>

<template>
	<div class="flex h-full items-center justify-center">
		<div class="relative">
			<div
				class="flex flex-col gap-2 border rounded-md p-2 border-gray-700 w-96 min-w-96 relative z-10"
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
			<div
				class="absolute bg-white top-0 left-0 right-0 bottom-[1rem] -z-10"
			></div>
			<div
				:class="
					cx(
						'absolute bg-white top-0 left-0 -bottom-[0.88rem] -z-10',
						data ? 'w-[72px]' : 'w-[7rem]',
					)
				"
			></div>
			<img
				:class="
					cx(
						'absolute -z-20',
						data ? 'left-[-2px] -bottom-[0.88rem]' : 'left-8 -bottom-[2px]',
					)
				"
				src="https://spotify-github-profile.vercel.app/api/view?uid=31m2rvl5monwbxr7ubbsjkucybcy&cover_image=true&theme=natemoo-re&show_offline=false&background_color=ffffff&interchange=true&bar_color=f5b13d&bar_color_cover=true"
			/>
			<a
				:class="
					cx(
						'absolute bottom-0 left-[7.25rem] w-[220px] h-[8px] z-10',
						data ? 'left-[80px]' : 'left-[7.25rem]',
					)
				"
				href="https://spotify-github-profile.vercel.app/api/view?uid=31m2rvl5monwbxr7ubbsjkucybcy&redirect=true"
			></a>
		</div>
	</div>
</template>
