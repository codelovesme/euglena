import { Particle } from "../../../particle";
import { PLog, PException, PACK } from "../../../common";
import { P } from "../../particles.h";
declare const nucleus: import("../..").CreateOrganelleModuleInterface<{
    incoming: {
        ReceiveParticle: P<{
            particle: Particle;
            source: string;
        }>;
    };
    outgoing: {
        Log: PLog;
        Exception: PException;
        ACK: PACK;
    };
}, "Nucleus">;
export { nucleus };
