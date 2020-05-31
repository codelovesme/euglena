import { CommonParticles } from "../../common";
declare const netServer: {
    v1: import("..").CreateOrganelleModuleInterface<{
        incoming: {
            GetAlive: CommonParticles["GetAlive"];
        };
        outgoing: {
            ACK: CommonParticles["ACK"];
            Exception: CommonParticles["Exception"];
            Impulse: CommonParticles["Impulse"];
            Log: CommonParticles["Log"];
        };
    }, undefined>;
};
export { netServer };
