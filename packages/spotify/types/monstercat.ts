export interface MonstercatApiResponse {
	Limit: number;
	Offset: number;
	Total: number;
	Data: Array<{
		Artists: Array<{
			CatalogRecordId: string;
			Id: string;
			Name: string;
			ProfileFileId: string;
			Public: boolean;
			Role: string;
			URI: string;
		}>;
		ArtistsTitle: string;
		BPM: number;
		Brand: string;
		BrandId: number;
		CreatorFriendly: boolean;
		DebutDate: string;
		Downloadable: boolean;
		Duration: number;
		Explicit: boolean;
		File: {
			Id: string;
			CreatedAt: string;
			Filepath: string;
			Filename: string;
			MimeType: string;
			Deleted: boolean;
			LastUser: string;
			LastAction: string;
			LastStatus: string;
			LastMessage: string;
			Statuses: null;
		} | null;
		GenrePrimary: string;
		GenreSecondary: string;
		ISRC: string;
		Id: string;
		InEarlyAccess: boolean;
		LockStatus: string;
		Public: boolean;
		Release: {
			ArtistsTitle: string;
			CatalogId: string;
			Description: string;
			Id: string;
			ReleaseDate: string;
			ReleaseDateTimezone: string;
			Tags: string[];
			Title: string;
			Type: string;
			UPC: string;
			Version: string;
		};
		Streamable: boolean;
		Tags: string[];
		Title: string;
		TrackNumber: number;
		Version: string;
	}>;
}
