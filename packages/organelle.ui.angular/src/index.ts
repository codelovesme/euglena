import { Particle, dco, CreateParticleUnion } from "@euglena/core";
import { ui, ccp, ACK, Exception, Log } from "@euglena/template";
import { EventEmitter, Injectable } from "@angular/core";
import { sys } from "cessnalib";

export type Sap = Particle<"Sap", { context: Context<object> }>;

@Injectable()
export class Context<State extends object> {
    stateEmitter?: EventEmitter<State>;
    tools?: {
        t: (particle: Particle) => Promise<Particle | void>;
        cp: CreateParticleUnion<ACK | Exception | Log | ui.Event>;
    };
}

let sap: Sap["data"];

export default dco<ui.UI, Sap>({
    Sap: async (p, tools) => {
        sap = p.data;
        (sap.context as any).tools = tools;
        sap.context.stateEmitter = new EventEmitter();
    },
    Render: async (p) => {
        if (sap.context.stateEmitter) {
            sap.context.stateEmitter.emit(p.data);
            return ccp("ACK");
        } else {
            return ccp("Exception", new sys.type.Exception("Organelle Angular is need its SAP"));
        }
    }
});
