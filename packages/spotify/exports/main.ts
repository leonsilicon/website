import { api, DataModel, Id } from '@-/database';
import type { GenericActionCtx } from 'convex/server';
import SpotifyWebApi from 'spotify-web-api-node';

export class SpotifyUser {
	ctx: GenericActionCtx<DataModel>;
	websiteUser: Id<'User'>;
	api: SpotifyWebApi;

	constructor(
		ctx: GenericActionCtx<DataModel>,
		{
			credentials,
			websiteUser,
		}: {
			websiteUser: Id<'User'>;
			credentials: {
				clientId: string;
				clientSecret: string;
			};
		},
	) {
		this.ctx = ctx;
		this.websiteUser = websiteUser;
		this.api = new SpotifyWebApi({
			clientId: credentials.clientId,
			clientSecret: credentials.clientSecret,
		});
	}

	async authorize() {
		this.api.createAuthorizeURL(['user-read-private', 'user-read-email'], '');
	}
}
