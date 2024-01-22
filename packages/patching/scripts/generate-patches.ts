#!/usr/bin/env tsx

import patches from '#patches/$.ts';
import { generatePatch } from '#utils/patch.ts';
import { program } from 'commander';

await program
	.argument(
		'[patch-ids...]',
		'The IDs of the patches to generate. If not provided, all patches will be generates.',
	)
	.action(async (patchesIds: string[]) => {
		const patchesIdsToGenerate = patchesIds.length > 0 ?
			patchesIds :
			Object.keys(patches);

		for (const patchId of patchesIdsToGenerate) {
			console.info(`Generating patch "${patchId}"...`);
			// eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-unnecessary-condition -- We need to apply patches synchronously to prevent race conditions for updating files
			await generatePatch({ patchId: patchId as keyof typeof patches });
			console.info(`Successfully generated patch "${patchId}"!`);
		}
	})
	.parseAsync();
