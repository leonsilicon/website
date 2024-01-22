export default defineAppConfig({
	convexUrl: process.env.NODE_ENV === 'production' ?
		'https://superb-cheetah-980.convex.cloud' :
		'https://neat-basilisk-216.convex.cloud',
});
