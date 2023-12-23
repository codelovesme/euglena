import { sys } from "cessnalib";
import { Exception } from "../../particle";

export type Method = "get" | "put" | "post" | "delete";

export type Native = object | string | boolean | number;

export interface Nucleus {
    onUnauthenticated(serverEuglenaName: string): void;
}

export abstract class HttpClient {
    constructor(
        private serverEuglenaName: string,
        /**
         * host:port pair
         */
        protected destination: string,
        private nucleus: Nucleus
    ) { }

    abstract send(method: Method, path: string, body: any, headers: sys.Headers): Promise<Native | Exception>;
    abstract get(path: string, headers?: sys.Headers): Promise<Native | Exception>;
    abstract post(path: string, body: any, headers?: sys.Headers): Promise<Native | Exception>;
    abstract put(path: string, body: any, headers?: sys.Headers): Promise<Native | Exception>;
    abstract delete(path: string, headers?: sys.Headers): Promise<Native | Exception>;
    public onUnauthenticated() {
        this.nucleus.onUnauthenticated(this.serverEuglenaName);
    }
}
