import { ClientOptions, NodeOptions } from "./typings";
import Node from "./structures/Node";
import Util from "./Util";
import { DefaultClientOptions, DefaultNodeOptions } from "./Constants";

export default class LavasfyClient {
    /** The provided options when the class was instantiated */
    public options: Readonly<ClientOptions>;
    /** The {@link Node}s are stored here */
    public nodes = new Map<string, Node>();
    /** A RegExp that will be used for validate and parse URLs */
    public readonly spotifyPattern!: RegExp;

    public constructor(options: ClientOptions, nodesOpt: NodeOptions[]) {
        Object.defineProperty(this, "spotifyPattern", {
            value: /(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|artist|album)[/:]([A-Za-z0-9]+)/
        });

        this.options = Object.freeze(Util.mergeDefault(DefaultClientOptions, options));
        for (const nodeOpt of nodesOpt) this.addNode(nodeOpt);
    }

    public addNode(options: NodeOptions): void {
        this.nodes.set(options.name, new Node(this, Util.mergeDefault(DefaultNodeOptions, options)));
    }

    public removeNode(id: string): boolean {
        if (!this.nodes.size) throw new Error("No nodes available, please add a node first...");
        if (!id) throw new Error("Provide a valid node identifier to delete it");

        return this.nodes.delete(id);
    }

    /**
     * @param {string} [id] The node id, if not specified it will return a random node. 
     */
    public getNode(id?: string): Node | undefined {
        if (!this.nodes.size) throw new Error("No nodes available, please add a node first...");

        if (!id) return [...this.nodes.values()].sort(() => 0.5 - Math.random())[0];

        return this.nodes.get(id);
    }

    /** Determine the URL is a valid Spotify URL or not */
    public isValidURL(url: string): boolean {
        return this.spotifyPattern.test(url);
    }
}
