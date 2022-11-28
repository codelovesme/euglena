import * as core from "@euglena/core";
import { particle, organelle } from "@euglena/template";

import common = particle.common;
import netClient = organelle.netClient;
import Particle = core.particle.Particle;

const dco = core.organelle.dco;

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
        t(common.cp("Log", { message: `Particle got to sent ${JSON.stringify(particle.meta)}`, level: "Info" }));
        try {
            const resp = await fetch(`http://${host}:${port}`, {
                method: "POST",
                body: JSON.stringify(particle)
            });
            return resp.json();
        } catch (e: any) {
            return common.cp("Exception", { message: JSON.stringify(e) });
        }
    }
});
