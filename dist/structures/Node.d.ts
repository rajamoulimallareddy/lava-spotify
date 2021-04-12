import LavasfyClient from "../Client";
import { LavalinkTrackResponse, NodeOptions } from "../typings";
import Resolver from "./Resolver";
export default class Node {
    client: LavasfyClient;
    resolver: Resolver;
    name: string;
    host: string;
    port: number | string;
    auth: string;
    secure?: string;
    private readonly methods;
    constructor(client: LavasfyClient, options: NodeOptions);
    load(url: string): Promise<LavalinkTrackResponse | null>;
}
