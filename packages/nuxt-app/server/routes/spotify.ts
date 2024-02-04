import { api } from '@-/database';
import { ConvexHttpClient } from 'convex/browser';
import SpotifyWebApi from 'spotify-web-api-node';
import appConfig from '../../app.config.js';

export default defineEventHandler(async (event: any) => {
	const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = useRuntimeConfig();
	console.log(useRuntimeConfig());
	const spotifyApi = new SpotifyWebApi({
		clientId: SPOTIFY_CLIENT_ID,
		clientSecret: SPOTIFY_CLIENT_SECRET,
		redirectUri: 'http://localhost:3000/callbacks/spotify'
	});

	const http = new ConvexHttpClient(appConfig.convexUrl);
	const user = await http.query(api.v.user.get, { username: 'leonsilicon' });

	if (user === null) {
		return;
	}

	const scopes = [
		'playlist-read-private',
		'playlist-modify-private',
		'playlist-modify-public',
	];

	return sendRedirect(
		event,
		await spotifyApi.createAuthorizeURL(
			scopes,
			encodeURIComponent(JSON.stringify({ userId: user._id })),
		),
		302,
	);
});
