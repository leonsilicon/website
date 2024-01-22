import { execa } from 'execa';

await execa('pnpm exec convex deploy', {
	env: {
		CONVEX_DEPLOY_KEY: process.env.CONVEX_DEPLOY_KEY,
	},
});

process.argv[2] = 'build';
process.argv[3] = '--preset=github_pages';

// @ts-expect-error: `nuxi/cli` doesn't provide types
import('nuxi/cli');
