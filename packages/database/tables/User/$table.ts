import { v } from 'convex/values';
import { table } from 'corvex';

export const User = table(
	'User',
	v.object({
		username: v.string(),
	}),
	(t) => t.index('by_username', ['username']),
)({});
