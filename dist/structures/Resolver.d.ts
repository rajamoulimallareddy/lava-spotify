import { LavalinkTrack, LavalinkTrackResponse } from "../typings";
import Node from "./Node";
export default class Resolver {
    node: Node;
    client: import("..").LavasfyClient;
    cache: Map<string, LavalinkTrack>;
    constructor(node: Node);
    get token(): string;
    get playlistLoadLimit(): number;
    get autoResolve(): boolean;
    getTrack(id: string): Promise<LavalinkTrackResponse | any>;
    getPlaylist(id: string): Promise<LavalinkTrackResponse | any>;
    getAlbum(id: string): Promise<LavalinkTrackResponse | any>;
    getArtist(id: string): Promise<LavalinkTrackResponse | any>;
    private getPlaylistTracks;
    private resolve;
    private retrieveTrack;
    private buildUnresolved;
    private buildResponse;
}
