import { domc } from "../../organelle/define-organelle-module-create";
import { CommonParticles } from "..";

const logger = {
    v1: domc<{
        incoming: {
            Log: CommonParticles["Log"];
        };
        outgoing: {
            ACK: CommonParticles["ACK"];
            Exception: CommonParticles["Exception"];
        };
    }>(["Log"], ["ACK", "Exception"])
};

export { logger };
