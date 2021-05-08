import { ui, Sap, Particle, Render, PEvent, CreateOrganelleParticles, PACK, PException, PLog } from "@euglena/core";
import { Injectable } from "@angular/core";
import { sys } from "cessnalib";

@Injectable()
export class Context {
    render?: (p: Render) => void;
    tools?: {
        t: (particle: Particle) => Promise<Particle | void>;
        cp: CreateOrganelleParticles<{
            ACK: PACK;
            Exception: PException;
            Log: PLog;
            Event: PEvent;
        }>;
    };
}

type SapData = { context: Context };

let sap: SapData;

export default ui.v1.com<Sap<SapData>>({
    Sap: async (p, tools) => {
        sap = p.data;
        (sap.context as any).tools = tools;
    },
    Render: async (p, { t, cp }) => {
        if (sap.context.render) {
            sap.context.render(p);
            return cp.ACK();
        } else {
            return cp.Exception(new sys.type.Exception("Render function supplied in SAP not implemented!"));
        }
    }
});
