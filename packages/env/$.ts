import { z } from 'zod';

export function getEnv() {
	return z.object({
		CONVEX_URL: z.string(),
		TOGGL_TRACK_API_TOKEN: z.string(),
		EIGHTSLEEP_EMAIL: z.string(),
		EIGHTSLEEP_PASSWORD: z.string(),
		EIGHTSLEEP_CLIENT_ID: z.string(),
		EIGHTSLEEP_CLIENT_SECRET: z.string(),
	}).parse(process.env);
}
