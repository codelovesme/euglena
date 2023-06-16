import { EventEmitter, Injectable } from "@angular/core";
import { CreateParticleUnion, Particle, cp, dco } from "@euglena/core";
import { ACK, Exception, cell, sys } from "@euglena/template";
import * as cessnalib from "cessnalib";

export type Sap = cell.organelle.Sap<{ context: Context<object> }>;

@Injectable()
export class Context<State extends object> {
    stateEmitter?: EventEmitter<State>;
    tools?: {
        t: (particle: Particle) => Promise<Particle | void>;
        cp: CreateParticleUnion<ACK | Exception | sys.log.Log | sys.io.ui.Event>;
    };
}

let sap: Sap["data"];

export default dco<sys.io.ui.UI, Sap>({
    Sap: async (p, tools) => {
        sap = p.data;
        (sap.context as any).tools = tools;
        sap.context.stateEmitter = new EventEmitter();
    },
    Render: async (p) => {
        if (sap.context.stateEmitter) {
            sap.context.stateEmitter.emit(p.data);
            return cp<ACK>("ACK");
        } else {
            return cp<Exception>("Exception", new cessnalib.sys.Exception("Organelle Angular is need its SAP"));
        }
    }
});
