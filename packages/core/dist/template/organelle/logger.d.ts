import { CommonParticles } from "..";
declare const logger: {
    v1: import("../..").CreateOrganelleModuleInterface<{
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
