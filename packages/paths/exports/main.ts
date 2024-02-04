import { join } from 'desm';
import path from 'pathe';

const monorepoDirpath = join(import.meta.url, '../../..');
export const packageDirpaths = {
	monorepo: monorepoDirpath,
	patching: path.join(monorepoDirpath, 'packages/patching'),
	database: path.join(monorepoDirpath, 'packages/database'),
};
