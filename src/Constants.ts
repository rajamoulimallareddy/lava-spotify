import { ClientOptions, NodeOptions } from "./typings";

export const DefaultClientOptions: ClientOptions = {
    audioOnlyResults: false,
    useSpotifyMetadata: false,
    autoResolve: false
};

export const DefaultNodeOptions: NodeOptions = {
    name: "",
    url: "",
    auth: "",
    secure: false
};
