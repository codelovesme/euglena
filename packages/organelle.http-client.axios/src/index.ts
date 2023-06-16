import * as cessnalib from "cessnalib";
import { cp, dco } from "@euglena/core";
import { cell, createException, sys } from "@euglena/template";
import axios from "axios";

import http = sys.io.net.http;

const capitalizeWord = (string: string) => {
    return string[0].toUpperCase() + string.slice(1);
};
const capitalizeHeaders = (headers: { [x: string]: string }) => {
    return Object.keys(headers).reduce((acc, key) => ({ ...acc, [capitalizeWord(key)]: headers[key] }), {});
};
let destination: string;
const parsePathParams = (path: string): string[] => {
    return path.split("/:").slice(1);
};
const _http = dco<http.HttpClient, cell.organelle.Sap<{
    /**
     * host:port pair
     */
    destination: string
}>>({
    Sap: async (p) => {
        destination = p.data.destination;
    },
    HttpImpulse: async (p) => {
        const {
            data: { path, headers, body, method, pathParams, queryParams }
        } = p;

        //Path params
        const pathVariables = parsePathParams(path);
        const pathWithPathParams = pathVariables.reduce((acc, curr) => acc.replace(`:${curr}`, pathParams[curr]), path);

        //Query params
        let pathWithAllParams = pathWithPathParams;
        const queryParamKeys = Object.keys(queryParams);
        if (queryParamKeys.length > 0) {
            pathWithAllParams += "?" + queryParamKeys
                .map(key => `${key}=${queryParams[key]}`)
                .join("&");
        }
        const url = `${destination}${pathWithAllParams}`;
        let resp: any = undefined;
        if (method === "get" || method === "delete") {
            resp = await axios[method](url, { headers });
        } else if (method === "post" || method === "put") {
            resp = await axios[method](url, body, { headers });
        } else {
            return createException("Exception", new cessnalib.sys.Exception(`Unknown Http method: ${method}`))
        }
        return cp<http.Response>("Response", {
            body: resp.data,
            headers: capitalizeHeaders(resp.headers),
            status: resp.status
        });
    }
});

export default _http;
