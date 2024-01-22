import { getEnv } from '@-/env';
import { ConvexHttpClient } from 'convex/browser';
import onetime from 'onetime';
import { retry } from 'ts-retry-promise';

export const getConvex = onetime(() => {
	const { CONVEX_URL, CONVEX_SECRET } = getEnv();
	const http = new ConvexHttpClient(CONVEX_URL);

	return {
		async query(fn, args) {
			return retry(
				async () => {
					const functionName = (fn as any)[Symbol.for('functionName')];

					try {
						return await http.query(functionName, {
							...args,
							secret: CONVEX_SECRET,
						});
					} catch (error: any) {
						console.error(
							`Convex query error @ ${functionName}\n${error.message}`,
						);
						throw error;
					}
				},
				{
					retryIf(error: any) {
						return (
							error.message.includes('fetch failed') ||
							error.message.includes('socket hang up') ||
							error.message.includes('ECONNRESET')
						);
					},
					retries: 5,
				},
			);
		},
		async mutation(fn, args) {
			const functionName = (fn as any)[Symbol.for('functionName')];

			try {
				return await http.mutation(functionName, {
					...args,
					secret: CONVEX_SECRET,
				});
			} catch (error: any) {
				console.error(
					`Convex mutation error @ ${functionName}\n${error.message}`,
				);
				throw error;
			}
		},
	} as ConvexHttpClient;
});
