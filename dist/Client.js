"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("./structures/Node"));
const Util_1 = __importDefault(require("./Util"));
const Constants_1 = require("./Constants");
class LavasfyClient {
    constructor(options, nodesOpt) {
        /** The {@link Node}s are stored here */
        this.nodes = new Map();
        Object.defineProperty(this, "spotifyPattern", {
            value: /(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|artist|album)[/:]([A-Za-z0-9]+)/
        });
        this.options = Object.freeze(Util_1.default.mergeDefault(Constants_1.DefaultClientOptions, options));
        for (const nodeOpt of nodesOpt)
            this.addNode(nodeOpt);
    }
    addNode(options) {
        this.nodes.set(options.name, new Node_1.default(this, Util_1.default.mergeDefault(Constants_1.DefaultNodeOptions, options)));
    }
    removeNode(id) {
        if (!this.nodes.size)
            throw new Error("No nodes available, please add a node first...");
        if (!id)
            throw new Error("Provide a valid node identifier to delete it");
        return this.nodes.delete(id);
    }
    /**
     * @param {string} [id] The node id, if not specified it will return a random node.
     */
    getNode(id) {
        if (!this.nodes.size)
            throw new Error("No nodes available, please add a node first...");
        if (!id)
            return [...this.nodes.values()].sort(() => 0.5 - Math.random())[0];
        return this.nodes.get(id);
    }
    /** Determine the URL is a valid Spotify URL or not */
    isValidURL(url) {
        return this.spotifyPattern.test(url);
    }
}
exports.default = LavasfyClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLDZEQUFxQztBQUNyQyxrREFBMEI7QUFDMUIsMkNBQXVFO0FBRXZFLE1BQXFCLGFBQWE7SUFROUIsWUFBbUIsT0FBc0IsRUFBRSxRQUF1QjtRQUxsRSx3Q0FBd0M7UUFDakMsVUFBSyxHQUFHLElBQUksR0FBRyxFQUFnQixDQUFDO1FBS25DLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQzFDLEtBQUssRUFBRSxtR0FBbUc7U0FDN0csQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQUksQ0FBQyxZQUFZLENBQUMsZ0NBQW9CLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUMvRSxLQUFLLE1BQU0sT0FBTyxJQUFJLFFBQVE7WUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFTSxPQUFPLENBQUMsT0FBb0I7UUFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLGNBQUksQ0FBQyxJQUFJLEVBQUUsY0FBSSxDQUFDLFlBQVksQ0FBQyw4QkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakcsQ0FBQztJQUVNLFVBQVUsQ0FBQyxFQUFVO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUk7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGdEQUFnRCxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLEVBQUU7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7UUFFekUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxPQUFPLENBQUMsRUFBVztRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1FBRXhGLElBQUksQ0FBQyxFQUFFO1lBQUUsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFNUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsc0RBQXNEO0lBQy9DLFVBQVUsQ0FBQyxHQUFXO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekMsQ0FBQztDQUNKO0FBM0NELGdDQTJDQyJ9