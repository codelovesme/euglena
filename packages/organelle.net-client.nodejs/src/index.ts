import { dco, cp } from "@euglena/core";
import { cell, sys, type } from "@euglena/template";
import http from "axios";

let destination: string;

export default dco<sys.io.net.bare.NetClient, cell.organelle.Sap<{
    destination: string
}>>({
    Sap: async (p) => { destination = p.data.destination },
    Impulse: async (impulse, { cp: _cp, t }) => {
        t(_cp("Log", { message: `Particle got to sent ${JSON.stringify(impulse.data.particle.meta)}`, level: "Info" }));
        try {
            const response = await http.post(destination, impulse);
            return response.data;
        } catch (e: any) {
            return cp<type.Exception>("Exception", { message: JSON.stringify(e) });
        }
    }
});
