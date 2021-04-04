import { CommonParticles } from "..";
declare const logger: {
    v1: import("../../organelle").CreateOrganelleModuleInterface<{
        incoming: {
            Log: CommonParticles["Log"];
        };
        outgoing: {
            ACK: CommonParticles["ACK"];
            Exception: CommonParticles["Exception"];
        };
    }, undefined>;
};
export { logger };
