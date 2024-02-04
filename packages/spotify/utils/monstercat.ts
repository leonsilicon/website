import type { MonstercatApiResponse } from '../types/monstercat.ts';

export async function getMonstercatPlayerSongs(
	{ offset, limit }: { offset: number; limit: number },
): Promise<MonstercatApiResponse> {
	const response = await fetch(
		`https://player.monstercat.app/api/catalog/browse?offset=${offset}&limit=${limit}&sort=-date&types[]=Single&types[]=EP&types[]=Album`,
	);
	return response.json();
}
