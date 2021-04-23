"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const Util_1 = __importDefault(require("../Util"));
class Resolver {
    constructor(node) {
        this.node = node;
        this.client = this.node.client;
        this.cache = new Map();
    }
    get token() {
        return this.client.token;
    }
    get playlistPageLimit() {
        return this.client.options.playlistPageLimit === 0
            ? Infinity
            : this.client.options.playlistPageLimit;
    }
    async getAlbum(id) {
        const album = await Util_1.default.tryPromise(async () => {
            return (await node_superfetch_1.default
                .get(`${this.client.baseURL}/albums/${id}`)
                .set("Authorization", this.token)).body;
        });
        const response = {
            type: "PLAYLIST",
            playlistName: album === null || album === void 0 ? void 0 : album.name,
            tracks: (album === null || album === void 0 ? void 0 : album.tracks.items.length) ? (await Promise.all(album.tracks.items.map(x => this.resolve(x)))) : []
        };
        return (album === null || album === void 0 ? void 0 : album.tracks.items.length) ? response : null;
    }
    async getPlaylist(id) {
        const playlist = await Util_1.default.tryPromise(async () => {
            return (await node_superfetch_1.default
                .get(`${this.client.baseURL}/playlists/${id}`)
                .set("Authorization", this.token)).body;
        });
        const playlistTracks = playlist ? await this.getPlaylistTracks(playlist) : [];
        const response = {
            type: "PLAYLIST",
            playlistName: playlist === null || playlist === void 0 ? void 0 : playlist.name,
            tracks: (await Promise.all(playlistTracks.map(x => this.resolve(x.track))))
        };
        return playlist ? response : null;
    }
    async getTrack(id) {
        const track = await Util_1.default.tryPromise(async () => {
            return (await node_superfetch_1.default
                .get(`${this.client.baseURL}/tracks/${id}`)
                .set("Authorization", this.token)).body;
        });
        const lavaTrack = track && await this.resolve(track);
        const result = {
            type: "TRACK",
            playlistName: null,
            tracks: lavaTrack ? [lavaTrack] : []
        };
        return lavaTrack ? result : null;
    }
    async getPlaylistTracks(playlist, currPage = 1) {
        if (!playlist.tracks.next || currPage >= this.playlistPageLimit)
            return playlist.tracks.items;
        currPage++;
        const { body } = await node_superfetch_1.default
            .get(playlist.tracks.next)
            .set("Authorization", this.token);
        const { items, next } = body;
        const mergedPlaylistTracks = playlist.tracks.items.concat(items);
        if (next && currPage < this.playlistPageLimit)
            return this.getPlaylistTracks({
                tracks: {
                    items: mergedPlaylistTracks,
                    next
                }
            }, currPage);
        else
            return mergedPlaylistTracks;
    }
    async resolve(track) {
        const cached = this.cache.get(track.id);
        if (cached)
            return Util_1.default.structuredClone(cached);
        try {
            const lavaTrack = await this.retrieveTrack(track);
            if (lavaTrack) {
                if (this.client.options.useSpotifyMetadata) {
                    Object.assign(lavaTrack.info, {
                        title: track.name,
                        author: track.artists.map(x => x.name).join(", "),
                        uri: track.external_urls.spotify
                    });
                }
                this.cache.set(track.id, Object.freeze(lavaTrack));
            }
            return Util_1.default.structuredClone(lavaTrack);
        }
        catch {
            return undefined;
        }
    }
    async retrieveTrack(track) {
        try {
            const params = new URLSearchParams({
                identifier: `ytsearch:${track.artists.map(x => x.name).join(", ")} - ${track.name} ${this.client.options.audioOnlyResults ? "Audio" : ""}`
            });
            // @ts-expect-error 2322
            const { body: response } = await node_superfetch_1.default
                .get(`http${this.node.secure ? 's' : ''}://${this.node.host}:${this.node.port}/loadtracks?${params.toString()}`)
                .set("Authorization", this.node.auth);
            return response.tracks[0];
        }
        catch {
            return undefined;
        }
    }
}
exports.default = Resolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9SZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHNFQUFzQztBQUV0QyxtREFBMkI7QUFDM0IsTUFBcUIsUUFBUTtJQUl6QixZQUEwQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUg3QixXQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDMUIsVUFBSyxHQUFHLElBQUksR0FBRyxFQUF5QixDQUFDO0lBRVQsQ0FBQztJQUV4QyxJQUFXLEtBQUs7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBTSxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFXLGlCQUFpQjtRQUN4QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixLQUFLLENBQUM7WUFDOUMsQ0FBQyxDQUFDLFFBQVE7WUFDVixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWtCLENBQUM7SUFDakQsQ0FBQztJQUVNLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBVTtRQUM1QixNQUFNLEtBQUssR0FBRyxNQUFNLGNBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDM0MsT0FBTyxDQUFDLE1BQU0seUJBQU87aUJBQ2hCLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxXQUFXLEVBQUUsRUFBRSxDQUFDO2lCQUMxQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQW9CLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRztZQUNiLElBQUksRUFBRSxVQUFVO1lBQ2hCLFlBQVksRUFBRSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsSUFBSTtZ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