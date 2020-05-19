import { CommonParticles, domc, P } from "@euglena/core";

const temperature = {
    v1: domc("Temperature")<{
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
