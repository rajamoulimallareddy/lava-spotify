export interface NodeOptions {
    name: string;
    host: string;
    port: number | string;
    auth: string;
    group: string;
}

export interface LavalinkTrack {
    track: string;
    info: {
        identifier: string;
        isSeekable: boolean;
        author: string;
        length: number;
        isStream: boolean;
        position: number;
        title: string;
        uri: string;
    };
}

export interface LavalinkTrackResponse {
    type: "TRACK_LOADED" | "PLAYLIST_LOADED" | "SEARCH_RESULT" | "NO_MATCHES" | "LOAD_FAILED";
    playlistName: string | undefined;
    tracks: LavalinkTrack[];
    exception?: {
        message: string;
        severity: string;
    };
}
