import { domc } from "../define-organelle-module-create";
import { P } from "../particles.h";
import { CommonParticles } from "../../common";

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
