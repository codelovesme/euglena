import * as core from "@euglena/core";
import { organelle } from "@euglena/template";
import http from "axios";

import netClient = organelle.netClient;
import Particle = core.particle.Particle;

const dco = core.organelle.dco;

export type Sap = Particle<"Sap">;

export default dco<netClient.NetClient,Sap>({
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
        t(cp("Log",{ message: `Particle got to sent ${JSON.stringify(particle.meta)}`, level: "Info" }));
        try {
            return (await http.post(`http://${host}:${port}`, particle)).data;
        } catch (e:any) {
            return cp("Exception",{ message: JSON.stringify(e) });
        }
    }
});
