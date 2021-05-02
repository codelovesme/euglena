import { Particle } from "../../../particle";
import { PLog, PException, PParticles, PACK } from "../..";
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
        Particles: PParticles;
    };
}, "Nucleus">;
export { nucleus };
