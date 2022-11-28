import { cp, dco, Particle } from "@euglena/core";
import { organelle } from "@euglena/template";
import axios from "axios";

import httpClient = organelle.httpClient;

export type Sap = particle.Particle<"Sap">;

const capitalizeWord = (string: string) => {
    return string[0].toUpperCase() + string.slice(1);
};
const capitalizeHeaders = (headers: { [x: string]: string }) => {
    return Object.keys(headers).reduce((acc, key) => ({ ...acc, [capitalizeWord(key)]: headers[key] }), {});
};
const _httpClient = dco<httpClient.HttpClient, Sap>({
    Sap: async () => {},
    Get: async (p) => {
        const {
            data: { url, headers }
        } = p;
        const resp = await axios.get(url, { headers });
        return cp<httpClient.Response>("Response", {
            body: resp.data,
            headers: capitalizeHeaders(resp.headers),
            status: resp.status
        });
    },
    Post: async (p) => {
        const {
            data: { url, headers, body }
        } = p;
        const resp = await axios.post(url, body, { headers });
        return cp<httpClient.Response>("Response", {
            body: resp.data,
            headers: capitalizeHeaders(resp.headers),
            status: resp.status
        });
    },
    Delete: async (p) => {
        const { url, headers } = p.data;
        const resp = await axios.delete(url, { headers });
        return cp<httpClient.Response>("Response", {
            body: resp.data,
            headers: capitalizeHeaders(resp.headers),
            status: resp.status
        });
    },
    Put: async (p) => {
        const {
            data: { url, headers, body }
        } = p;
        const resp = await axios.put(url, body, { headers });
        return cp<httpClient.Response>("Response", {
            body: resp.data,
            headers: capitalizeHeaders(resp.headers),
            status: resp.status
        });
    }
});

export default _httpClient;
