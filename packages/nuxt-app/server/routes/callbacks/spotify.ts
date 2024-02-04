import { api } from '@-/database';
import { ConvexHttpClient } from 'convex/browser';
import SpotifyWebApi from 'spotify-web-api-node';
import appConfig from '../../../app.config.js';

export default defineEventHandler(async (event: any) => {
	const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = useRuntimeConfig();
	const spotifyApi = new SpotifyWebApi({
		clientId: SPOTIFY_CLIENT_ID,
		clientSecret: SPOTIFY_CLIENT_SECRET,
		redirectUri: 'http://localhost:3000/callbacks/spotify',
	});

	const { code, state: encodedState } = getQuery(event);
	const state = JSON.parse(decodeURIComponent(encodedState));
	const data = await spotifyApi.authorizationCodeGrant(code);
	const http = new ConvexHttpClient(appConfig.convexUrl);
	await http.mutation(api.v.userSpotifyData.upsert, {
		data: {
			user: state.userId,
			accessToken: data.body.access_token,
			refreshToken: data.body.refresh_token,
			expirationUnixTimestamp: Date.now() + data.body.expires_in * 1000,
		},
	});

	await sendRedirect(event, '/', 302);
});
