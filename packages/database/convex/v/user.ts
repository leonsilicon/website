import { v } from 'convex/values';
import { Id } from '../_generated/dataModel.js';
import { internalMutation } from '../_generated/server.js';

export const ensure = internalMutation({
	args: {
		username: v.string(),
	},
	async handler(ctx, { username }) {
		const existingUser = await ctx.db.query('User').withIndex(
			'by_username',
			(q) => q.eq('username', username),
		).first();

		let userId: Id<'User'>;
		if (existingUser === null) {
			userId = await ctx.db.insert('User', {
				username,
			});
		} else {
			userId = existingUser._id;
		}

		return userId;
	},
});
