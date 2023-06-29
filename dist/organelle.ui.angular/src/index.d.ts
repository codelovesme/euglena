import { EventEmitter } from "@angular/core";
import { CreateParticleUnion, Particle } from "@euglena/core";
import { ACK, Exception, cell, sys } from "@euglena/template";
export type Sap = cell.organelle.Sap<{
    context: Context<object>;
}>;
export declare class Context<State extends object> {
    stateEmitter?: EventEmitter<State>;
    tools?: {
        t: (particle: Particle) => Promise<Particle | void>;
        cp: CreateParticleUnion<ACK | Exception | sys.log.Log | sys.io.ui.Event>;
    };
}
declare const _default: import("@euglena/core").CreateOrganelle<import("@euglena/core").OrganelleInteractions>;
export default _default;
//# sourceMappingURL=index.d.ts.map