import { ClientOptions, NodeOptions } from "./typings";
import Node from "./structures/Node";
export default class LavasfyClient {
    /** The provided options when the class was instantiated */
    options: Readonly<ClientOptions>;
    /** The {@link Node}s are stored here */
    nodes: Map<string, Node>;
    /** A RegExp that will be used for validate and parse URLs */
    readonly spotifyPattern: RegExp;
    constructor(options: ClientOptions, nodesOpt: NodeOptions[]);
    addNode(options: NodeOptions): void;
    removeNode(id: string): boolean;
    /**
     * @param {string} [id] The node id, if not specified it will return a random node.
     */
    getNode(id?: string): Node | undefined;
    /** Determine the URL is a valid Spotify URL or not */
    isValidURL(url: string): boolean;
}
