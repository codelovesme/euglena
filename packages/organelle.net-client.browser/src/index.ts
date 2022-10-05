import { dco, Particle } from "@euglena/core";
import { particle, organelle } from "@euglena/template";

import ccp = particle.ccp;
import netClient = organelle.netClient;

export type Sap = Particle<"Sap">;

export default dco<netClient.NetClient, Sap>({
    Sap: async () => {},
    TransmitParticle: async (
        {
            data: {
                particle,
                target: { host, port }
            }
        },
        { t }
    ) => {
        t(ccp("Log", { message: `Particle got to sent ${JSON.stringify(particle.meta)}`, level: "Info" }));
        try {
            const resp = await fetch(`http://${host}:${port}`, {
                method: "POST",
                body: JSON.stringify(particle)
            });
            return resp.json();
        } catch (e: any) {
            return ccp("Exception", { message: JSON.stringify(e) });
        }
    }
});
