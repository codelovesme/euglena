import { P } from "../particles.h";
import { CommonParticles } from "../../common";
declare const thermometer: {
    v1: import("..").CreateOrganelleModuleInterface<{
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
