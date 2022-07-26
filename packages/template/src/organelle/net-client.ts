import { domc, Particle, P } from "@euglena/core";
import { CommonParticles } from "../particle/particles.h";

const netClient = {
    v1: domc<{
        in: {
            TransmitParticle: P<{
                particle: Particle;
                target: {
                    host: string;
                    port: number;
                };
            }>;
        };
        out: {
            ACK: CommonParticles["ACK"];
            Exception: CommonParticles["Exception"];
            Log: CommonParticles["Log"];
        };
    }>(["TransmitParticle"], ["Log", "ACK", "Exception"])
};

export { netClient };
