import SpotifyWebApi from 'spotify-web-api-node';
import { getMonstercatPlayerSongs } from './monstercat.ts';

export async function ensureMonstercatPlaylist(
	{ spotifyApi }: { spotifyApi: SpotifyWebApi },
) {
	const playlists = await spotifyApi.getUserPlaylists();
	let monstercatPlaylist = playlists.body.items.find((item) =>
		item.name === 'Monstercat'
	);

	if (monstercatPlaylist === undefined) {
		monstercatPlaylist = (await spotifyApi.createPlaylist('Monstercat', {
			description:
				'A playlist of Monstercat songs kept in sync with the Monstercat Player Catalog',
		})).body;
	}

	return monstercatPlaylist;
}

export async function* getMonstercatSpotifyTracks(
	{ spotifyApi, offset }: { spotifyApi: SpotifyWebApi; offset: number },
) {
	const limit = 100;
	for (;; offset += limit) {
		const { Data: songs } = await getMonstercatPlayerSongs({
			offset,
			limit,
		});

		if (songs.length === 0) {
			break;
		}

		for (const [songIndex, song] of songs.entries()) {
			const searchQuery = `${song.ArtistsTitle} ${song.Title}`.replaceAll(
				'.',
				'',
			);
			const tracks = await spotifyApi.searchTracks(
				searchQuery,
				{ limit: 10 },
			);

			const track = tracks.body.tracks?.items.find((track) => {
				if (track === null) {
					return false;
				}

				const hasArtist = track.artists.some((artist) =>
					song.ArtistsTitle.includes(artist.name)
				);

				return hasArtist && track.name.includes(song.Title);
			});

			if (track === undefined) {
				yield { success: false, song, songNumber: offset + songIndex + 1 };
			} else {
				yield {
					success: true,
					song,
					track,
					songNumber: offset + songIndex + 1,
				};
			}
		}
	}
}
