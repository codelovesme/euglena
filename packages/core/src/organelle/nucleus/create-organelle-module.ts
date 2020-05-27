import { Particle, PLog, PException, PACK } from "../..";
import { domc, P } from "..";

export default domc<
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
