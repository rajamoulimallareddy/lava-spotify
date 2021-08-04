"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const petitio_1 = __importDefault(require("petitio"));
const spotify_url_info_1 = require("spotify-url-info");
const Util_1 = __importDefault(require("../Util"));
class Resolver {
    constructor(node) {
        this.node = node;
        this.client = this.node.client;
        this.cache = new Map();
    }
    get autoResolve() {
        return this.client.options.autoResolve;
    }
    async getTrack(id) {
        const tracks = await spotify_url_info_1.getTracks(`https://open.spotify.com/track/${id}`);
        const unresolvedTracks = this.buildUnresolved(tracks[0]);
        return this.buildResponse("TRACK", this.autoResolve ? [await unresolvedTracks.resolve()] : [unresolvedTracks]);
    }
    async getPlaylist(id) {
        const tracks = await spotify_url_info_1.getTracks(`https://open.spotify.com/playlist/${id}`);
        const metaData = await spotify_url_info_1.getData(`https://open.spotify.com/playlist/${id}`);
        let unresolvedPlaylistTracks;
        // @ts-expect-error no typings
        if (typeof tracks[0].track === "object") {
            // @ts-expect-error no typings
            unresolvedPlaylistTracks = tracks.filter(x => x.track).map(track => this.buildUnresolved(track.track));
        }
        else {
            // @ts-expect-error no typings
            unresolvedPlaylistTracks = tracks.filter(x => x.track).map(track => this.buildUnresolved(track));
        }
        return this.buildResponse("PLAYLIST", this.autoResolve ? (await Promise.all(unresolvedPlaylistTracks.map((x) => x.resolve()))).filter(Boolean) : unresolvedPlaylistTracks, metaData.name);
    }
    async getAlbum(id) {
        var _a;
        const tracks = await spotify_url_info_1.getTracks(`https://open.spotify.com/album/${id}`);
        const metaData = await spotify_url_info_1.getData(`https://open.spotify.com/album/${id}`);
        const unresolvedAlbumTracks = (_a = tracks.map(track => track && this.buildUnresolved(track))) !== null && _a !== void 0 ? _a : [];
        return this.buildResponse("PLAYLIST", this.autoResolve ? (await Promise.all(unresolvedAlbumTracks.map((x) => x.resolve()))).filter(Boolean) : unresolvedAlbumTracks, metaData.name);
    }
    async getArtist(id) {
        var _a;
        const tracks = await spotify_url_info_1.getTracks(`https://open.spotify.com/artist/${id}`);
        const metaData = await spotify_url_info_1.getData(`https://open.spotify.com/artist/${id}`);
        const unresolvedAlbumTracks = (_a = tracks.map(track => track && this.buildUnresolved(track))) !== null && _a !== void 0 ? _a : [];
        return this.buildResponse("PLAYLIST", this.autoResolve ? (await Promise.all(unresolvedAlbumTracks.map((x) => x.resolve()))).filter(Boolean) : unresolvedAlbumTracks, metaData.name);
    }
    async resolve(unresolvedTrack) {
        const cached = this.cache.get(unresolvedTrack.info.identifier);
        if (cached)
            return Util_1.default.structuredClone(cached);
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
        return Util_1.default.structuredClone(lavaTrack);
    }
    async retrieveTrack(unresolvedTrack) {
        const params = new URLSearchParams({ identifier: `ytsearch:${unresolvedTrack.info.author} - ${unresolvedTrack.info.title} ${this.client.options.audioOnlyResults ? "Audio" : ""}` });
        const response = await petitio_1.default(`http${this.node.secure ? "s" : ""}://${this.node.url}/loadtracks?${params.toString()}`).header("Authorization", this.node.auth).json();
        return response.tracks[0];
    }
    buildUnresolved(spotifyTrack) {
        const _this = this; // eslint-disable-line
        return {
            info: {
                identifier: spotifyTrack.id,
                title: spotifyTrack.name,
                author: spotifyTrack.artists.map((x) => x.name).join(" "),
                uri: spotifyTrack.external_urls.spotify,
                length: spotifyTrack.duration_ms
            },
            resolve() {
                return _this.resolve(this);
            }
        };
    }
    buildResponse(type, tracks = [], playlistName, exceptionMsg) {
        return Object.assign({
            type,
            tracks,
            playlistName
        }, exceptionMsg ? { exception: { message: exceptionMsg, severity: "COMMON" } } : {});
    }
}
exports.default = Resolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9SZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUE4QjtBQUM5Qix1REFBOEQ7QUFFOUQsbURBQTJCO0FBRzNCLE1BQXFCLFFBQVE7SUFJekIsWUFBMEIsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07UUFIN0IsV0FBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzFCLFVBQUssR0FBRyxJQUFJLEdBQUcsRUFBeUIsQ0FBQztJQUVSLENBQUM7SUFFekMsSUFBVyxXQUFXO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBWSxDQUFDO0lBQzVDLENBQUM7SUFFTSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQVU7UUFDNUIsTUFBTSxNQUFNLEdBQUcsTUFBTSw0QkFBUyxDQUFDLGtDQUFrQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFFLENBQUMsTUFBTSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDeEksQ0FBQztJQUVNLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBVTtRQUMvQixNQUFNLE1BQU0sR0FBRyxNQUFNLDRCQUFTLENBQUMscUNBQXFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDMUUsTUFBTSxRQUFRLEdBQUcsTUFBTSwwQkFBTyxDQUFDLHFDQUFxQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzFFLElBQUksd0JBQXdCLENB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