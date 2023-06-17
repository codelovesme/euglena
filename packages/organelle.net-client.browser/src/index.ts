import { cp, dco } from "@euglena/core";
import { cell, sys } from "@euglena/template";

let destination: string;

export default dco<sys.io.net.bare.NetClient, cell.organelle.Sap<{
    destination: string;
}>>({
    Sap: async (p) => { destination = p.data.destination },
    Impulse: async (impulse, { t }) => {
        t(cp("Log", { message: `Particle got to sent ${JSON.stringify(impulse.data.particle.meta)}`, level: "Info" }));
        try {
            const resp = await fetch(destination, {
                method: "POST",
                body: JSON.stringify(impulse)
            });
            return resp.json();
        } catch (e: any) {
            return cp("Exception", { message: JSON.stringify(e) });
        }
    }
});
