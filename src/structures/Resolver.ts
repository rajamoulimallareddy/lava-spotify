import petitio from "petitio";
import { getTracks, getData, Tracks } from "spotify-url-info";
import { LavalinkTrack, LavalinkTrackResponse, UnresolvedTrack } from "../typings";
import Util from "../Util";
import Node from "./Node";

export default class Resolver {
    public client = this.node.client;
    public cache = new Map<string, LavalinkTrack>();

    public constructor(public node: Node) { }

    public get autoResolve(): boolean {
        return this.client.options.autoResolve!;
    }

    public async getTrack(id: string): Promise<LavalinkTrackResponse | any> {
        const tracks = await getTracks(`https://open.spotify.com/track/${id}`);
        const unresolvedTracks = this.buildUnresolved(tracks[0]);
        return this.buildResponse("TRACK", this.autoResolve ? ([await unresolvedTracks.resolve()] as LavalinkTrack[]) : [unresolvedTracks]);
    }

    public async getPlaylist(id: string): Promise<LavalinkTrackResponse | any> {
        const tracks = await getTracks(`https://open.spotify.com/playlist/${id}`);
        const metaData = await getData(`https://open.spotify.com/playlist/${id}`);
        let unresolvedPlaylistTracks;
        // @ts-expect-error no typings
        if (typeof tracks[0].track === "object") {
            // @ts-expect-error no typings
            unresolvedPlaylistTracks = tracks.filter(x => x.track).map(track => this.buildUnresolved(track.track));
        } else {
            // @ts-expect-error no typings
            unresolvedPlaylistTracks = tracks.filter(x => x.track).map(track => this.buildUnresolved(track));
        }
        return this.buildResponse("PLAYLIST", this.autoResolve ? ((await Promise.all(unresolvedPlaylistTracks.map((x) => x.resolve()))).filter(Boolean) as LavalinkTrack[]) : unresolvedPlaylistTracks, metaData.name);
    }

    public async getAlbum(id: string): Promise<LavalinkTrackResponse | any> {
        const tracks = await getTracks(`https://open.spotify.com/album/${id}`);
        const metaData = await getData(`https://open.spotify.com/album/${id}`);
        const unresolvedAlbumTracks = tracks.map(track => track && this.buildUnresolved(track)) ?? [];
        return this.buildResponse("PLAYLIST", this.autoResolve ? ((await Promise.all(unresolvedAlbumTracks.map((x) => x.resolve()))).filter(Boolean) as LavalinkTrack[]) : unresolvedAlbumTracks, metaData.name);
    }

    public async getArtist(id: string): Promise<LavalinkTrackResponse | any> {
        const tracks = await getTracks(`https://open.spotify.com/artist/${id}`);
        const metaData = await getData(`https://open.spotify.com/artist/${id}`);
        const unresolvedAlbumTracks = tracks.map(track => track && this.buildUnresolved(track)) ?? [];
        return this.buildResponse("PLAYLIST", this.autoResolve ? ((await Promise.all(unresolvedAlbumTracks.map((x) => x.resolve()))).filter(Boolean) as LavalinkTrack[]) : unresolvedAlbumTracks, metaData.name);
    }

    private async resolve(unresolvedTrack: UnresolvedTrack): Promise<LavalinkTrack | undefined> {
        const cached = this.cache.get(unresolvedTrack.info.identifier);
        if (cached) return Util.structuredClone(cached);

        const lavaTrack = await this.retrieveTrack(unresolvedTrack);
        if (lavaTrack) {
            if (this.client.options.useSpotifyMetadata) {
                Object.assign(lavaTrack.info, {
                    title: unresolvedTrack.info.title,
                    author: unresolvedTrack.info.author,
                    uri: unresolvedTrack.info.uri
                });
            }
            this.cache.set(unresolvedTrack.info.identifier, Object.freeze(lavaTrack));
        }
        return Util.structuredClone(lavaTrack);
    }

    private async retrieveTrack(unresolvedTrack: UnresolvedTrack): Promise<LavalinkTrack | undefined> {
        const params = new URLSearchParams({ identifier: `ytsearch:${unresolvedTrack.info.author} - ${unresolvedTrack.info.title} ${this.client.options.audioOnlyResults ? "Audio" : ""}` });
        const response: LavalinkTrackResponse<LavalinkTrack> = await petitio(`http${this.node.secure ? "s" : ""}://${this.node.url}/loadtracks?${params.toString()}`).header("Authorization", this.node.auth).json();
        return response.tracks[0];
    }

    private buildUnresolved(spotifyTrack: Tracks): UnresolvedTrack {
        const _this = this; // eslint-disable-line
        return {
            info: {
                identifier: spotifyTrack.id,
                title: spotifyTrack.name,
                author: spotifyTrack.artists!.map((x) => x.name).join(" "),
                uri: spotifyTrack.external_urls.spotify,
                length: spotifyTrack.duration_ms
            },
            resolve(): Promise<LavalinkTrack | undefined> {
                return _this.resolve(this);
            }
        };
    }

    private buildResponse(type: LavalinkTrackResponse["type"], tracks: Array<UnresolvedTrack | LavalinkTrack> = [], playlistName?: string, exceptionMsg?: string): LavalinkTrackResponse {
        return Object.assign(
            {
                type,
                tracks,
                playlistName
            },
            exceptionMsg ? { exception: { message: exceptionMsg, severity: "COMMON" } } : {}
        );
    }
}
