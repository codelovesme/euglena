import { P } from "../../organelle/particles.h";
import { CommonParticles } from "..";
declare const thermometer: {
    v1: import("../..").CreateOrganelleModuleInterface<{
        incoming: {
            Listen: P<undefined>;
        };
        outgoing: {
            ACK: CommonParticles["ACK"];
            Temperature: P<number>;
            Log: CommonParticles["Log"];
            Exception: CommonParticles["Exception"];
        };
    }, undefined>;
};
export { thermometer };
