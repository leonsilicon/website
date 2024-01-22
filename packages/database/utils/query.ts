import { v } from 'convex/values';
import { query } from '../convex/_generated/server.js';

export const protectedQuery = (({ args, handler }: any) =>
	query({
		args: { secret: v.string(), ...args },
		handler(ctx, args: any) {
			if (args.secret !== process.env.CONVEX_SECRET) {
				throw new Error('Invalid secret');
			}

			return handler(ctx, args);
		},
	})) as typeof query;
