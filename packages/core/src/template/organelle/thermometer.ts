import { domc } from "../../organelle/define-organelle-module-create";
import { P } from "../../organelle/particles.h";
import { CommonParticles } from "../particle/particles.h";

const thermometer = {
    v1: domc<{
        incoming: {
            Listen: P<undefined>;
        };
        outgoing: {
            ACK: CommonParticles["ACK"];
            Temperature: P<number>;
            Log: CommonParticles["Log"];
            Exception: CommonParticles["Exception"];
        };
    }>(["Listen"], ["Temperature", "Log", "Exception", "ACK"])
};

export { thermometer };
