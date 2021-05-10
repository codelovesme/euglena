import { ui, Sap, Particle, PEvent, CreateOrganelleParticles, PACK, PException, PLog } from "@euglena/core";
import { EventEmitter, Injectable } from "@angular/core";
import { sys } from "cessnalib";

@Injectable()
export class Context<State extends object> {
    stateEmitter?: EventEmitter<State>;
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

type SapData = { context: Context<object> };

let sap: SapData;

export default ui.v1.com<Sap<SapData>>({
    Sap: async (p, tools) => {
        sap = p.data;
        (sap.context as any).tools = tools;
        sap.context.stateEmitter = new EventEmitter();
    },
    Render: async (p, { t, cp }) => {
        if (sap.context.stateEmitter) {
            sap.context.stateEmitter.emit(p.data);
            return cp.ACK();
        } else {
            return cp.Exception(new sys.type.Exception("Organelle Angular is need its SAP"));
        }
    }
});
