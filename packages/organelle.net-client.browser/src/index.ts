import { Sap } from "@euglena/core";
import { netClient } from "@euglena/template";

export default netClient.v1.com<Sap<undefined>>({
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
            const resp = await fetch(`http://${host}:${port}`, {
                method: "POST",
                body: JSON.stringify(particle)
            });
            return resp.json();
        } catch (e:any) {
            return cp.Exception({ message: JSON.stringify(e) });
        }
    }
});
