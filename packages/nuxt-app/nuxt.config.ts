import { outdent } from 'outdent';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	devtools: { enabled: true },
	css: ['./assets/css/global.css'],
	modules: ['@nuxtjs/tailwindcss', '@nuxt/image', 'nuxt-icon'],
	nitro: {
		rollupConfig: {
			external: ['@-/database'],
		},
		replace: {
			'parentPort': '',
		},
	},
	hooks: {
		'nitro:config'(nitroConfig) {
			nitroConfig.rollupConfig.output.banner = outdent`
				const parentPort = {
					on(event, cb) {
						process.on(event, cb);
					},
					postMessage: (msg) => {
						process.send(msg);
					}
				}
			`;
		},
	},
	alias: {
		'#utils/*': '../utils/*',
	},
	tailwindcss: {
		exposeConfig: true,
		viewer: true,
		// and more...
	},
});
