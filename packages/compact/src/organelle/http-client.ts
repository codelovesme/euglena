import axios from "axios";
import { Exception } from "../particle";
import { sys } from "cessnalib";

export type Method = "get" | "put" | "post" | "delete";

export type Native = object | string | boolean | number;

export class HttpClient {
    constructor(
        /**
         * host:port pair
         */
        protected destination: string
    ) { }

    async send(path: string, headers: sys.Headers, body: any, method: Method): Promise<Native | Exception> {
        const url = `${this.destination}/${path}`;
        let resp: any = undefined;
        try {
            if (method === "get" || method === "delete") {
                resp = await axios[method](url, { headers });
            } else if (method === "post" || method === "put") {
                resp = await axios[method](url, body, { headers });
            } else {
                return new Exception(`Unknown Http method: ${method}`);
            }
        } catch (e: any) {
            return new Exception(`Error occurred while running axios: ${e.message || JSON.stringify(e)}`);
        }
        if (resp.status < 200 || resp.status > 299) return new Exception(`Http error returned from server; Http Code: ${resp.status} Http Body: ${resp.data}`);
        return resp.data;
    }

    async get(path: string, headers: sys.Headers = {}) {
        return await this.send(path, headers, {}, "get");
    }
    async post(path: string, body: any, headers: sys.Headers = {}) {
        return await this.send(path, headers, body, "post");

    }
    async put(path: string, body: any, headers: sys.Headers = {}) {
        return await this.send(path, headers, body, "put");

    }
    async delete(path: string, headers: sys.Headers = {}) {
        return await this.send(path, headers, {}, "delete");

    }
}
