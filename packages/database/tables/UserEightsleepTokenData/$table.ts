import { v } from 'convex/values';
import { table } from 'corvex';

export const UserEightsleepTokenData = table(
	'User',
	v.object({
		user: v.id('User'),
		accessToken: v.string(),
		refreshToken: v.string(),
		userId: v.string(),
		expirationUnixTimestamp: v.number(),
	}),
	(t) => t.index('by_user', ['user']),
)({
	user: {
		foreignTable: 'User',
		hostIndex: 'by_user',
		onDelete: 'Cascade',
	},
});
