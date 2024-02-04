import { getEnv } from '@-/env';
import { packageDirpaths } from '@-/paths';
import { execa } from 'execa';

const userSpotifyData = await execa('convex', [
	'run',
	'v/userSpotifyTokenData:get',
], {
	stdio: 'inherit',
	cwd: packageDirpaths.database,
});
console.log(userSpotifyData);
