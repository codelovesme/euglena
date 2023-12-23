import { Exception, httpClient } from "@euglena/compact";
import { sys } from "cessnalib";

export type Method = "get" | "put" | "post" | "delete";

export type Native = object | string | boolean | number;

export class HttpClientFetch extends httpClient.HttpClient {
    constructor(
        serverEuglenaName: string,
        /**
         * host:port pair
         */
        destination: string,
        nucleus: httpClient.Nucleus
    ) {
        super(serverEuglenaName, destination, nucleus);
    }

    async send(method: Method, path: string, body?: any, headers: sys.Headers = {}): Promise<Native | Exception> {
        const url = `${this.destination}${path}`;
        let resp: any = undefined;
        try {
            resp = await fetch(url, {
                method: method,
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    // "Content-Type": "application/json",
                    ...headers
                },
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: body ? JSON.stringify(body) : undefined, // body data type must match "Content-Type" header
            })
        } catch (e: any) {
            return new Exception(`Error occurred while fetching: ${e.message || JSON.stringify(e)}`);
        }
        if (resp.status === 401) this.onUnauthenticated();
        //parse response body
        let data;
        const contentType: string = resp.headers.get('Content-Type') || resp.headers.get('content-type');
        if (contentType?.includes("application/json")) {
            data = await resp.json();
        } else {
            data = await resp.text();
        }
        if (resp.status < 200 || resp.status > 299) return new Exception(`Http error returned from server; Http Code: ${resp.status} Http Body: ${data}`);
        return data;
    }

    async get(path: string, headers?: sys.Headers): Promise<Native | Exception> {
        return await this.send("get", path, undefined, headers);
    }
    async post(path: string, body: any, headers?: sys.Headers): Promise<Native | Exception> {
        return await this.send("post", path, body, headers);
    }
    async put(path: string, body: any, headers: sys.Headers = {}): Promise<Native | Exception> {
        return await this.send("put", path, body, headers);
    }
    async delete(path: string, headers: sys.Headers = {}): Promise<Native | Exception> {
        return await this.send("delete", path, undefined, headers);
    }
}
