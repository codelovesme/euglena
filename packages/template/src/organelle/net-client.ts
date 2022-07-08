import { domc, Particle, P } from "@euglena/core";
import { CommonParticles } from "../particle/particles.h";

const netClient = {
    v1: domc<{
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
    }>(["TransmitParticle"], ["Log", "ACK", "Exception"])
};

export { netClient };
