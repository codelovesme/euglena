import { Particle } from "../../../particle";
import { PLog, PException, PACK } from "../..";
import { P } from "../../../organelle/particles.h";
declare const nucleus: import("../../..").CreateOrganelleModuleInterface<{
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
