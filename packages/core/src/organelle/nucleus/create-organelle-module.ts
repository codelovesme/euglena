import { Particle, PLog, PException, PACK } from "../..";
import { domc, P } from "..";

export default domc("Nucleus")<{
    incoming: {
        ReceiveParticle: P<{ particle: Particle; source: string }>;
    };
    outgoing: {
        Log: PLog;
        Exception: PException;
        ACK: PACK;
    };
}>(["ReceiveParticle"], ["ACK", "Exception", "Log"]);
