import { api, getConvex } from '@-/database';

export default defineNitroPlugin(async () => {
	const convex = getConvex();
	await convex.mutation(api.v.user.ensure, { username: 'leondreamed' });
});
