import { domc } from "@euglena/core";
import { CommonParticles } from "../particle/particles.h";

const netServer = {
    v1: domc<{
        in: {
            GetAlive: CommonParticles["GetAlive"];
        };
        out: {
            ACK: CommonParticles["ACK"];
            Exception: CommonParticles["Exception"];
            Impulse: CommonParticles["Impulse"];
            Log: CommonParticles["Log"];
        };
    }>(["GetAlive"], ["ACK", "Exception", "Impulse", "Log"])
};

export { netServer };
