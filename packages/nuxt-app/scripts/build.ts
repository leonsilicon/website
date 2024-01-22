import { execa } from 'execa';
import { packageDirpaths } from '@-/paths'

await execa('pnpm', ['exec', 'convex', 'deploy'], {
	env: {
		CONVEX_DEPLOY_KEY: process.env.CONVEX_DEPLOY_KEY,
		CONVEX_DEPLOYMENT: 'superb-cheetah-980',
	},
	stdio: 'inherit',
	cwd: packageDirpaths.database
});

process.argv[2] = 'build';
process.argv[3] = '--preset=github_pages';

// @ts-expect-error: `nuxi/cli` doesn't provide types
import('nuxi/cli');
