import { createPatchFileReplacer, definePatch } from '#utils/patch.ts';
import fs from 'node:fs';
import { outdent } from 'outdent';
import path from 'pathe';

export default definePatch({
	async patch({ temporaryPatchDirectory }) {
		const replace = createPatchFileReplacer({ temporaryPatchDirectory });

		// ESM loader hooks are currently not supported using `node:worker_threads` (see https://github.com/nodejs/node/issues/47747), so we create a wrapper `node:worker_thread` entrypoint that runs `import('node:child_process').fork`
		await fs.writeFileSync(
			path.join(temporaryPatchDirectory, 'dist/shared/worker-wrapper.mjs'),
			outdent`
				import { parentPort } from 'node:worker_threads';
				import { fork } from 'node:child_process';

				const forkProcess = fork(process.argv[2], {
					env: {
						...process.env,
						NODE_OPTIONS: '--import tsx'
					}
				});

				forkProcess.on('message', (msg) => {
					parentPort.postMessage(msg);
				})

				parentPort.on("message", async (msg) => {
					forkProcess.send(msg);
				});
			`,
		);

		await replace({
			files: ['dist/shared/nitro.4b3fd674.mjs'],
			from: [
				outdent`
					function initWorker(filename) {
				`,
				outdent`
					const worker = new Worker(filename);
				`,
				outdent`
					currentWorker = await initWorker(workerEntry);
				`,
			],
			to: [
				outdent`
					function initWorker(filename, options) {
				`,
				outdent`
					const worker = new Worker(filename, options);
				`,
				outdent`
					currentWorker = await initWorker(
						resolve(
							(await import('node:url')).fileURLToPath(import.meta.url),
							'../worker-wrapper.mjs'
						),
						{ argv: [workerEntry] },
					);
				`,
			],
		});
	},
});
