import { CommonParticles, domc } from "@euglena/core";

const logger = {
    v1: domc("Logger")<{
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
