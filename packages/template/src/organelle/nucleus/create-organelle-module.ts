import { domc, P, Particle } from "@euglena/core";
import { PLog, PException, PACK, PParticles } from "../../particle";

const nucleus = domc<
    {
        in: {
            ReceiveParticle: P<{ particle: Particle; source: string }>;
        };
        out: {
            Log: PLog;
            Exception: PException;
            ACK: PACK;
            Particles: PParticles;
        };
    },
    "Nucleus"
>(["ReceiveParticle"], ["ACK", "Exception", "Log", "Particles"], "Nucleus");

export { nucleus };
