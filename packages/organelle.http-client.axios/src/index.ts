import { httpClient, Sap } from "@euglena/core";
import axios from "axios";

export default httpClient.v1.com<Sap<undefined>>({
    Sap: async () => {},
    Get: async (p, { t, cp }) => {
        const {
            data: { url, headers }
        } = p;
        const resp = await axios.get(url, { headers });
        return cp.Response({
            body: resp.data,
            headers: resp.headers,
            status: resp.status
        });
    },
    Post: async (p, { t, cp }) => {
        const {
            data: { url, headers }
        } = p;
        const resp = await axios.get(url, { headers });
        return cp.Response({
            body: resp.data,
            headers: resp.headers,
            status: resp.status
        });
    }
});
