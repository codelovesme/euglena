import { domc } from "./organelle";
import { P } from "./organelle.h";
import { CommonParticles } from "../common";

const temperature = {
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

export { temperature };
