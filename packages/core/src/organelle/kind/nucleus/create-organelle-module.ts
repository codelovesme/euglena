import { Particle } from "../../../particle";
import { PLog, PException, PACK } from "../../../common";
import { P } from "../../particles.h";
import { domc } from "../../define-organelle-module-create";

const nucleus = domc<
    {
        incoming: {
            ReceiveParticle: P<{ particle: Particle; source: string }>;
        };
        outgoing: {
            Log: PLog;
            Exception: PException;
            ACK: PACK;
        };
    },
    "Nucleus"
>(["ReceiveParticle"], ["ACK", "Exception", "Log"], "Nucleus");

export { nucleus };
