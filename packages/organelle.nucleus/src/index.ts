import { cp, Particle } from "@euglena/particle";
import { domc } from "@euglena/organelle";
import { ccp } from "@euglena/common";

export default domc("Nucleus", {
    incoming: {
        ReceiveParticle: (particle: Particle, source: string) => cp("ReceiveParticle", { particle, source })
    },
    outgoing: {
        Log: ccp.Log,
        Exception: ccp.Exception,
        ACK: ccp.ACK
    }
});
