import { getEnv } from '@-/env';
import { packageDirpaths } from '@-/paths';
import dotenv from 'dotenv';
import fs from 'node:fs';
import { outdent } from 'outdent';
import path from 'pathe';

const env = dotenv.parse(fs.readFileSync(
	path.join(packageDirpaths.monorepo, '.env'),
));

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: env,
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
