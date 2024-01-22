import { api } from '@-/database';
import type { GenericActionCtx } from 'convex/server';
import { format } from 'date-fns';
import { DataModel, Id } from '../database/convex/_generated/dataModel.js';
import { EightsleepCredentials, EightsleepTokenData } from './types/auth.ts';

const TOKEN_TIME_BUFFER_SECONDS = 120;

const defaultHeaders = {
	'User-Agent': 'iOS App - 6.2.25/46523 - Apple iPhone16,1 - iOS 17.2.1',
	'Accept-Encoding': 'gzip',
	'Accept': 'application/json',
	'Content-Type': 'application/json',
};

export class Eightsleep {
	ctx: GenericActionCtx<DataModel>;
	websiteUser: Id<'User'>;
	credentials: EightsleepCredentials;
	tokenData: EightsleepTokenData | null;

	constructor(
		ctx: GenericActionCtx<DataModel>,
		{
			websiteUser,
			credentials,
			tokenData,
		}: {
			websiteUser: Id<'User'>;
			credentials: EightsleepCredentials;
			tokenData: EightsleepTokenData | null;
		},
	) {
		this.ctx = ctx;
		this.websiteUser = websiteUser;
		this.credentials = credentials;
		this.tokenData = tokenData;
	}

	async setTokenData(): Promise<EightsleepTokenData> {
		const response = await fetch(
			'https://auth-api.8slp.net/v1/tokens',
			{
				method: 'POST',
				headers: {
					...defaultHeaders,
				},
				body: JSON.stringify({
					client_id: this.credentials.clientId,
					client_secret: this.credentials.clientSecret,
					grant_type: 'password',
					username: this.credentials.email,
					password: this.credentials.password,
				}),
			},
		);

		const { access_token, refresh_token, expires_in, userId } = await response
			.json() as {
				access_token: string;
				refresh_token: string;
				token_type: string;
				expires_in: number;
				userId: string;
			};

		const tokenData: EightsleepTokenData = {
			accessToken: access_token,
			refreshToken: refresh_token,
			userId,
			expirationUnixTimestamp: Date.now() / 1000 + expires_in,
		};

		await this.ctx.runMutation(api.v.userEightsleepTokenData.create, {
			data: {
				user: this.websiteUser,
				...tokenData,
			},
		});

		return tokenData;
	}

	async getTokenData() {
		if (this.tokenData === null) {
			const tokenData = await this.setTokenData();
			return tokenData;
		}

		if (
			this.tokenData !== null &&
			(Date.now() / 1000) + TOKEN_TIME_BUFFER_SECONDS >
				this.tokenData.expirationUnixTimestamp
		) {
			const tokenData = await this.setTokenData();
			return tokenData;
		}

		return this.tokenData;
	}

	async getAggregateData({ date }: { date: Date }) {
		const { userId, accessToken } = await this.getTokenData();
		const response = await fetch(
			`https://app-api.8slp.net/v1/users/${userId}/metrics/aggregate?to=${
				format(date, 'yyyy-MM-dd')
			}&tz=America%2FToronto&metrics=bedtime,wakeup&periods=week`,
			{
				headers: {
					...defaultHeaders,
					'Authorization': `Bearer ${accessToken}`,
				},
			},
		);
		return await response.json() as {
			periods: Array<
				{
					name: string;
					date: string;
					samples: Array<
						{ date: string; avg: Array<{ name: string; value: string }> }
					>;
				}
			>;
		};
	}
}
