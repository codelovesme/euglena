import { CommonParticles, domc, P, Particle } from "@euglena/core";

export default domc("NetClient")<{
    incoming: {
        TransmitParticle: P<{
            particle: Particle;
            target: {
                host: string;
                port: number;
            };
        }>;
    };
    outgoing: {
        ACK: CommonParticles["ACK"];
        Exception: CommonParticles["Exception"];
        Log: CommonParticles["Log"];
    };
}>(["TransmitParticle"], ["Log", "ACK", "Exception"]);
