import axios from "axios";
import { Exception } from "../particle";
import { sys } from "cessnalib";

const capitalizeWord = (string: string) => {
    return string[0].toUpperCase() + string.slice(1);
};
const capitalizeHeaders = (headers: { [x: string]: string }) => {
    return Object.keys(headers).reduce((acc, key) => ({ ...acc, [capitalizeWord(key)]: headers[key] }), {});
};

export type Method = "get" | "put" | "post" | "delete";

export class HttpClient {
    constructor(
        /**
         * host:port pair
         */
        private destination: string
    ) { }

    async send(path: string, headers: sys.Headers, body: any, method: Method) {
        const url = `${this.destination}/${path}`;
        let resp: any = undefined;
        if (method === "get" || method === "delete") {
            resp = await axios[method](url, { headers });
        } else if (method === "post" || method === "put") {
            resp = await axios[method](url, body, { headers });
        } else {
            return new Exception(`Unknown Http method: ${method}`);
        }
        return {
            body: resp.data,
            headers: capitalizeHeaders(resp.headers),
            status: resp.status
        }
    }

    get(path: string, headers: sys.Headers) {
        return this.send(path, headers, {}, "get");
    }
    post(path: string, headers: sys.Headers, body: any) {
        return this.send(path, headers, body, "post");

    }
    put(path: string, headers: sys.Headers, body: any) {
        return this.send(path, headers, body, "put");

    }
    delete(path: string, headers: sys.Headers) {
        return this.send(path, headers, {}, "delete");

    }
}
