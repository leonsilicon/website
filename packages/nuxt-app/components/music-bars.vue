<script setup lang="ts">
import cx from "clsx";

const { hasData } = defineProps<{ hasData: boolean }>();
</script>

<template>
	<!-- Hides the artist + song name -->
	<div class="absolute bg-white top-0 left-0 right-0 bottom-[10px] -z-10"></div>
	<!-- Hides the cover image -->
	<div
		:class="
			cx(
				'absolute bg-white top-0 left-[-2px] -bottom-[14.08px] -z-10',
				hasData ? 'w-[90px]' : 'w-[7rem]',
			)
		"
	></div>
	<!-- We use the "novatorem" theme because it is the least prone to shifting the animated bars (it only happens when the artist's name has more than 50 characters, which should be very rare) -->
	<div
		:class="
			cx(
				'h-[80px] w-[320px] absolute -z-20 overflow-hidden bottom-0',
				hasData ? 'left-[-8px]' : 'left-[20px]',
			)
		"
	>
		<img
			class="object-fill scale-y-50 translate-y-[11px]"
			src="https://spotify-github-profile.vercel.app/api/view?uid=31m2rvl5monwbxr7ubbsjkucybcy&cover_image=true&theme=novatorem&show_offline=true&background_color=121212&interchange=false&bar_color=53b14f&bar_color_cover=true"
		/>
	</div>
	<a
		:class="
			cx(
				'absolute bottom-0 w-[200px] h-[5px] z-10',
				hasData ? 'left-[92px]' : 'left-[7.25rem]',
			)
		"
		href="https://spotify-github-profile.vercel.app/api/view?uid=31m2rvl5monwbxr7ubbsjkucybcy&redirect=true"
	></a>
</template>
