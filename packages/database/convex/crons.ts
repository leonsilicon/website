import { internal } from '#convex/_generated/api.js';
import { cronJobs } from 'convex/server';

const crons = cronJobs();

crons.interval(
	'update today data from APIs',
	{ minutes: 10 },
	internal.v.userTodayDataUpdate.updateFromApis,
);

export default crons;
