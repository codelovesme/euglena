import axios from "axios";
import { Exception, httpClient } from "@euglena/compact";
import { sys } from "cessnalib";

export type Method = "get" | "put" | "post" | "delete";

export type Native = object | string | boolean | number;

export class HttpClientAxios extends httpClient.HttpClient{
    constructor(
        /**
         * host:port pair
         */
        destination: string
    ) { 
        super(destination);
    }

    async send(method: Method, path: string, body: any,headers: sys.Headers = {}): Promise<Native | Exception> {
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

    async get(path: string, headers?: sys.Headers):Promise<Native | Exception> {
        return await this.send("get",path, {}, headers);
    }
    async post(path: string, body: any, headers?: sys.Headers): Promise<Native | Exception> {
        return await this.send("post",path, body, headers);
    }
    async put(path: string, body: any, headers: sys.Headers = {}):Promise<Native | Exception> {
        return await this.send("put",path, body, headers);
    }
    async delete(path: string, headers: sys.Headers = {}): Promise<Native | Exception> {
        return await this.send("delete",path, {}, headers);
    }
}
