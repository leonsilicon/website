export interface TodayData {
	lastFetchedUnixTimestamp: number;
	yesterdayBedtime: string | null;
	todayWakeup: string | null;
	timeEntries: TimeEntry[];
}

export interface TimeEntry {
	description: string;
	startUnixTimestamp: number;
	stopUnixTimestamp: number | null;
}
