import { Sap } from "@euglena/core";
import { httpClient } from "@euglena/template";
import axios from "axios";

const capitalizeWord = (string: string) => {
    return string[0].toUpperCase() + string.slice(1);
};
const capitalizeHeaders = (headers: { [x: string]: string }) => {
    return Object.keys(headers).reduce((acc, key) => ({ ...acc, [capitalizeWord(key)]: headers[key] }), {});
};
const _httpClient = httpClient.v1.com<Sap<undefined>>({
    Sap: async () => {},
    Get: async (p, { t, cp }) => {
        const {
            data: { url, headers }
        } = p;
        const resp = await axios.get(url, { headers });
        return cp.Response({
            body: resp.data,
            headers: capitalizeHeaders(resp.headers),
            status: resp.status
        });
    },
    Post: async (p, { t, cp }) => {
        const {
            data: { url, headers, body }
        } = p;
        const resp = await axios.post(url, body, { headers });
        return cp.Response({
            body: resp.data,
            headers: capitalizeHeaders(resp.headers),
            status: resp.status
        });
    },
    Delete: async (p, { t, cp }) => {
        const { url, headers } = p.data;
        const resp = await axios.delete(url, { headers });
        return cp.Response({
            body: resp.data,
            headers: capitalizeHeaders(resp.headers),
            status: resp.status
        });
    },
    Put: async (p, { t, cp }) => {
        const {
            data: { url, headers, body }
        } = p;
        const resp = await axios.put(url, body, { headers });
        return cp.Response({
            body: resp.data,
            headers: capitalizeHeaders(resp.headers),
            status: resp.status
        });
    }
});

export default _httpClient;