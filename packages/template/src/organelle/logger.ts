import { domc } from "@euglena/core";
import { CommonParticles } from "../particle/particles.h";

const logger = {
    v1: domc<{
        in: {
            Log: CommonParticles["Log"];
        };
        out: {
            ACK: CommonParticles["ACK"];
            Exception: CommonParticles["Exception"];
        };
    }>(["Log"], ["ACK", "Exception"])
};

export { logger };
