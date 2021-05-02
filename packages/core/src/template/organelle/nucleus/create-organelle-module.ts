import { Particle } from "../../../particle";
import { PLog, PException, PParticles, PACK } from "../..";
import { P } from "../../../organelle/particles.h";
import { domc } from "../../../organelle/define-organelle-module-create";

const nucleus = domc<
    {
        incoming: {
            ReceiveParticle: P<{ particle: Particle; source: string }>;
        };
        outgoing: {
            Log: PLog;
            Exception: PException;
            ACK: PACK;
            Particles: PParticles;
        };
    },
    "Nucleus"
>(["ReceiveParticle"], ["ACK", "Exception", "Log", "Particles"], "Nucleus");

export { nucleus };
