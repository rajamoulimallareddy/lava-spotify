"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    get playlistPageLoadLimit() {
        return this.client.options.playlistPageLoadLimit === 0
            ? Infinity
            : this.client.options.playlistPageLoadLimit;
    }
    getAlbum(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const album = yield Util_1.default.tryPromise(() => __awaiter(this, void 0, void 0, function* () {
                return (yield node_superfetch_1.default
                    .get(`${this.client.baseURL}/albums/${id}`)
                    .set("Authorization", this.token)).body;
            }));
            return {
                playlistName: album === null || album === void 0 ? void 0 : album.name,
                type: album ? "PLAYLIST" : "NO_MATCHES",
                tracks: album
                    ? (yield Promise.all(album.tracks.items.map(x => this.resolve(x)))).filter(Boolean)
                    : []
            };
        });
    }
    getPlaylist(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = yield Util_1.default.tryPromise(() => __awaiter(this, void 0, void 0, function* () {
                return (yield node_superfetch_1.default
                    .get(`${this.client.baseURL}/playlists/${id}`)
                    .set("Authorization", this.token)).body;
            }));
            const playlistTracks = playlist ? yield this.getPlaylistTracks(playlist) : [];
            return {
                playlistName: playlist === null || playlist === void 0 ? void 0 : playlist.name,
                type: playlist ? "PLAYLIST" : "NO_MATCHES",
                tracks: (yield Promise.all(playlistTracks.map(x => this.resolve(x.track)))).filter(Boolean)
            };
        });
    }
    getTrack(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const track = yield Util_1.default.tryPromise(() => __awaiter(this, void 0, void 0, function* () {
                return (yield node_superfetch_1.default
                    .get(`${this.client.baseURL}/tracks/${id}`)
                    .set("Authorization", this.token)).body;
            }));
            const lavaTrack = track && (yield this.resolve(track));
            return {
                type: lavaTrack ? "TRACK_LOADED" : "NO_MATCHES",
                playlistName: '',
                tracks: lavaTrack ? [lavaTrack] : []
            };
        });
    }
    getPlaylistTracks(playlist, currPage = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!playlist.tracks.next || currPage >= this.playlistPageLoadLimit)
                return playlist.tracks.items;
            currPage++;
            const { body } = yield node_superfetch_1.default
                .get(playlist.tracks.next)
                .set("Authorization", this.token);
            const { items, next } = body;
            const mergedPlaylistTracks = playlist.tracks.items.concat(items);
            if (next && currPage < this.playlistPageLoadLimit)
                return this.getPlaylistTracks({
                    tracks: {
                        items: mergedPlaylistTracks,
                        next
                    }
                }, currPage);
            else
                return mergedPlaylistTracks;
        });
    }
    resolve(track, ytMusic = this.client.options.alwaysUseYTMusic) {
        return __awaiter(this, void 0, void 0, function* () {
            const cached = this.cache.get(track.id);
            if (cached)
                return Util_1.default.structuredClone(cached);
            try {
                const params = new URLSearchParams({
                    identifier: `yt${ytMusic ? "m" : ""}search:${track.artists[0].name} - ${track.name}${this.client.options.filterAudioOnlyResult && !ytMusic ? " description:(\"Auto-generated by YouTube.\")" : ""}`
                }).toString();
                // @ts-expect-error 2322
                const { body } = yield node_superfetch_1.default
                    .get(`http://${this.node.options.host}:${this.node.options.port}/loadtracks?${params}`)
                    .set("Authorization", this.node.options.auth);
                if (body.tracks.length) {
                    this.cache.set(track.id, Object.freeze(body.tracks[0]));
                    return Util_1.default.structuredClone(body.tracks[0]);
                }
                else if (!ytMusic) {
                    return this.resolve(track, true);
                }
                else {
                    return undefined;
                }
            }
            catch (_a) {
                return undefined;
            }
        });
    }
}
exports.default = Resolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9SZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLHNFQUFzQztBQUV0QyxtREFBMkI7QUFFM0IsTUFBcUIsUUFBUTtJQUl6QixZQUEwQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUg3QixXQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDMUIsVUFBSyxHQUFHLElBQUksR0FBRyxFQUF5QixDQUFDO0lBRVQsQ0FBQztJQUV4QyxJQUFXLEtBQUs7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBTSxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFXLHFCQUFxQjtRQUM1QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHFCQUFxQixLQUFLLENBQUM7WUFDbEQsQ0FBQyxDQUFDLFFBQVE7WUFDVixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXNCLENBQUM7SUFDckQsQ0FBQztJQUVZLFFBQVEsQ0FBQyxFQUFVOztZQUM1QixNQUFNLEtBQUssR0FBRyxNQUFNLGNBQUksQ0FBQyxVQUFVLENBQUMsR0FBUyxFQUFFO2dCQUMzQyxPQUFPLENBQUMsTUFBTSx5QkFBTztxQkFDaEIsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLFdBQVcsRUFBRSxFQUFFLENBQUM7cUJBQzFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBb0IsQ0FBQztZQUNoRSxDQUFDLENBQUEsQ0FBQyxDQUFDO1lBRUgsT0FBTztnQkFDSCxZQUFZLEVBQUUsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLElBQUk7Z0JBQ3pCLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxZQUFZO2dCQUM5QyxNQUFNLEVBQUUsS0FBSztvQkFDVCxDQUFDLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFvQjtvQkFDdEcsQ0FBQyxDQUFDLEVBQUU7YUFDWCxDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRVksV0FBVyxDQUFDLEVBQVU7O1lBQy9CLE1BQU0sUUFBUSxHQUFHLE1BQU0sY0FBSSxDQUFDLFVBQVUsQ0FBQyxHQUFTLEVBQUU7Z0JBQzlDLE9BQU8sQ0FBQyxNQUFNLHlCQUFPO3FCQUNoQixHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sY0FBYyxFQUFFLEVBQUUsQ0FBQztxQkFDN0MsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUF1QixDQUFDO1lBQ25FLENBQUMsQ0FBQSxDQUFDLENBQUM7WUFFSCxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFFOUUsT0FBTztnQkFDSCxZQUFZLEVBQUUsUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLElBQUk7Z0JBQzVCLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxZQUFZO2dCQUNqRCxNQUFNLEVBQUUsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQW9CO2FBQ2pILENBQUM7UUFDTixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsRUFBVTs7WUFDNUIsTUFBTSxLQUFLLEdBQUcsTUFBTSxjQUFJLENBQUMsVUFBVSxDQUFDLEdBQVMsRUFBRTtnQkFDM0MsT0FBTyxDQUFDLE1BQU0seUJBQU87cUJBQ2hCLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxXQUFXLEVBQUUsRUFBRSxDQUFDO3FCQUMxQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQW9CLENBQUM7WUFDaEUsQ0FBQyxDQUFBLENBQUMsQ0FBQztZQUVILE1BQU0sU0FBUyxHQUFHLEtBQUssS0FBSSxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUEsQ0FBQztZQUVyRCxPQUFPO2dCQUNILElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWTtnQkFDL0MsWUFBWSxFQUFFLEVBQUU7Z0JBQ2hCLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7YUFDdkMsQ0FBQztRQUNOLENBQUM7S0FBQTtJQUVhLGlCQUFpQixDQUFDLFFBSy9CLEVBQUUsUUFBUSxHQUFHLENBQUM7O1lBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMscUJBQXFCO2dCQUFFLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDbEcsUUFBUSxFQUFFLENBQUM7WUFFWCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQVEsTUFBTSx5QkFBTztpQkFDOUIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO2lCQUN6QixHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV0QyxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFtRSxJQUFJLENBQUM7WUFFN0YsTUFBTSxvQkFBb0IsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFakUsSUFBSSxJQUFJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxxQkFBcUI7Z0JBQUUsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7b0JBQzdFLE1BQU0sRUFBRTt3QkFDSixLQUFLLEVBQUUsb0JBQW9CO3dCQUMzQixJQUFJO3FCQUNQO2lCQUNKLEVBQUUsUUFBUSxDQUFDLENBQUM7O2dCQUNSLE9BQU8sb0JBQW9CLENBQUM7UUFDckMsQ0FBQztLQUFBO0lBRWEsT0FBTyxDQUFDLEtBQW1CLEVBQUUsVUFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBaUI7O1lBQ3RGLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN4QyxJQUFJLE1BQU07Z0JBQUUsT0FBTyxjQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRWhELElBQUk7Z0JBQ0EsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFlLENBQUM7b0JBQy9CLFVBQVUsRUFBRSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFBLENBQUMsQ0FBQyxFQUFFLFVBQVUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsK0NBQStDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtpQkFDck0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUVkLHdCQUF3QjtnQkFDeEIsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFvQyxNQUFNLHlCQUFPO3FCQUMxRCxHQUFHLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxlQUFlLE1BQU0sRUFBRSxDQUFDO3FCQUN0RixHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVsRCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO29CQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hELE9BQU8sY0FBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQy9DO3FCQUFNLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQ2pCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQ3BDO3FCQUFNO29CQUNILE9BQU8sU0FBUyxDQUFDO2lCQUNwQjthQUNKO1lBQUMsV0FBTTtnQkFDSixPQUFPLFNBQVMsQ0FBQzthQUNwQjtRQUNMLENBQUM7S0FBQTtDQUNKO0FBcEhELDJCQW9IQyJ9
