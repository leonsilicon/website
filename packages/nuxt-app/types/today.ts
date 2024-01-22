export interface TodayData {
	lastFetchedUnixTimestamp: number;
	yesterdayBedtime: string | null;
	todayWakeup: string | null;
	timeEntries: TimeEntry[];
}

export interface TimeEntry {
	description: string;
	atUnixTimestamp: number;
	stopUnixTimestamp: number | null;
}
