import client from "@euglena/organelle.net-client";
import { Sap } from "@euglena/core";
import http from "axios";

export default client.com<Sap<undefined>>({
    Sap: async () => {},
    TransmitParticle: async (
        {
            data: {
                particle,
                target: { host, port }
            }
        },
        { cp, t }
    ) => {
        t(cp.Log({ message: `Particle got to sent ${JSON.stringify(particle.meta)}`, level: "Info" }));
        try {
            return (await http.post(`http://${host}:${port}`, particle)).data;
        } catch (e) {
            return cp.Exception({ message: JSON.stringify(e) });
        }
    }
});