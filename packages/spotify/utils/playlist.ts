import SpotifyWebApi from 'spotify-web-api-node';
import { getSpotifyWebApi } from './api';
import { getMonstercatPlayerSongs } from './monstercat';

export async function getMonstercatPlaylist({ api }: { api: SpotifyWebApi }) {
	const playlists = await api.getUserPlaylists();
	let monstercatPlaylist = playlists.body.items.find((item) =>
		item.name === 'Monstercat'
	);

	if (monstercatPlaylist === undefined) {
		monstercatPlaylist = (await api.createPlaylist('Monstercat', {
			description:
				'A playlist of Monstercat songs kept in sync with the Monstercat Player Catalog',
		})).body;
	}
}

export async function getMonstercatSpotifyTracks(
	{ api }: { api: SpotifyWebApi },
) {
	const limit = 100;
	for (let offset = 0;; offset += limit) {
		const { Data: songs } = await getMonstercatPlayerSongs({
			offset,
			limit,
		});

		if (songs.length === 0) {
			break;
		}

		for (const song of songs) {
			const tracks = await api.searchTracks(
				`${song.ArtistsTitle} ${song.Title}`,
				{ limit: 10 },
			);

			console.log(tracks);
			break;
		}

		break;
	}
}
