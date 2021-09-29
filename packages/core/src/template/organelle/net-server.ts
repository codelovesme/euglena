import { domc } from "../../organelle/define-organelle-module-create";
import { CommonParticles } from "../particle/particles.h";

const netServer = {
    v1: domc<{
        incoming: {
            GetAlive: CommonParticles["GetAlive"];
        };
        outgoing: {
            ACK: CommonParticles["ACK"];
            Exception: CommonParticles["Exception"];
            Impulse: CommonParticles["Impulse"];
            Log: CommonParticles["Log"];
        };
    }>(["GetAlive"], ["ACK", "Exception", "Impulse", "Log"])
};

export { netServer };
