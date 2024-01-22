process.argv[2] = 'build';
process.argv[3] = '--preset=github_pages';
// @ts-expect-error: `nuxi/cli` doesn't provide types
import('nuxi/cli');
