export interface EightsleepTokenData {
	accessToken: string;
	refreshToken: string;
	userId: string;
	expirationUnixTimestamp: number;
}

export interface EightsleepCredentials {
	email: string;
	password: string;
	clientId: string;
	clientSecret: string;
}
