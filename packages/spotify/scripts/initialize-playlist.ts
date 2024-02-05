import { getEnv } from '@-/env';
import { packageDirpaths } from '@-/paths';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { execa } from 'execa';
import { jsonl } from 'js-jsonl';
import fs from 'node:fs';
import { setTimeout } from 'node:timers/promises';
import path from 'pathe';
import SpotifyWebApi from 'spotify-web-api-node';
import {
	ensureMonstercatPlaylist,
	getMonstercatSpotifyTracks,
} from '../utils/playlist.ts';

dotenv.config({
	path: path.join(packageDirpaths.monorepo, '.env'),
});

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = getEnv();

const { stdout } = await execa('convex', [
	'run',
	'v/userSpotifyTokenData:get',
	JSON.stringify({
		from: { user: { username: 'leonsilicon' } },
	}),
], {
	stdio: 'pipe',
	cwd: packageDirpaths.database,
});

const { accessToken } = JSON.parse(stdout);

const spotifyApi = new SpotifyWebApi({
	clientId: SPOTIFY_CLIENT_ID,
	clientSecret: SPOTIFY_CLIENT_SECRET,
});
spotifyApi.setAccessToken(accessToken);

const monstercatPlaylist = await ensureMonstercatPlaylist({ spotifyApi });

const savedTracksFilepath = path.join(
	packageDirpaths.spotify,
	'data/songs.jsonl',
);
if (!fs.existsSync(savedTracksFilepath)) {
	fs.writeFileSync(savedTracksFilepath, '');
}

const savedTracks = jsonl.parse(fs.readFileSync(savedTracksFilepath, 'utf8'));

// Save the songs to a `songs.jsonl` file
for await (
	const trackResult of getMonstercatSpotifyTracks({
		spotifyApi,
		offset: savedTracks.length,
	})
) {
	if (trackResult.success) {
		console.log(
			`#${trackResult.songNumber} ` +
				chalk.green(
					`[FOUND - ${trackResult.song.Title} ${
						chalk.italic('by')
					} ${trackResult.song.ArtistsTitle}]`,
				),
			`${trackResult.track!.name} ${chalk.italic('by')} ${
				trackResult.track!.artists.map((artist) => artist.name).join(', ')
			}`,
		);
	} else {
		console.log(
			`#${trackResult.songNumber} ` +
				chalk.red(
					`[NOT FOUND - ${trackResult.song.Title} ${
						chalk.italic('by')
					} ${trackResult.song.ArtistsTitle}]`,
				),
		);
	}

	fs.appendFileSync(savedTracksFilepath, JSON.stringify(trackResult) + '\n');
	await setTimeout(350);
}

// Add the songs to the playlist
const trackResults = jsonl.parse(fs.readFileSync(savedTracksFilepath, 'utf8'))
	.filter(
		(trackResult: any) => trackResult.success,
	);

for (let i = 0; i < trackResults.length; i += 100) {
	await spotifyApi.addTracksToPlaylist(
		monstercatPlaylist.id,
		trackResults.slice(i, i + 100).map((trackResult: any) =>
			trackResult.track.uri
		),
	);
}
