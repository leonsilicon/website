import { v } from 'convex/values';
import { mutation } from '../convex/_generated/server.js';

export const protectedMutation = (({ args, handler }: any) =>
	mutation({
		args: { secret: v.string(), ...args },
		handler(ctx, args: any) {
			if (args.secret !== process.env.CONVEX_SECRET) {
				throw new Error('Invalid secret');
			}

			return handler(ctx, args);
		},
	})) as typeof mutation;
