import { P, domc } from "@euglena/core";
import { CommonParticles } from "../particle/particles.h";

const thermometer = {
    v1: domc<{
        in: {
            Listen: P<undefined>;
        };
        out: {
            ACK: CommonParticles["ACK"];
            Temperature: P<number>;
            Log: CommonParticles["Log"];
            Exception: CommonParticles["Exception"];
        };
    }>(["Listen"], ["Temperature", "Log", "Exception", "ACK"])
};

export { thermometer };
