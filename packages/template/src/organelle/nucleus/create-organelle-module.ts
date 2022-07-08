import { domc, P, Particle } from "@euglena/core";
import { PLog, PException, PACK, PParticles } from "../../particle";

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
