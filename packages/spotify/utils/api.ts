import SpotifyWebApi from 'spotify-web-api-node';
import type { SpotifyCredentials } from '../types/auth.ts';

export const getSpotifyWebApi = (credentials: SpotifyCredentials) =>
	new SpotifyWebApi({
		clientId: credentials.clientId,
		clientSecret: credentials.clientSecret,
	});
