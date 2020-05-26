import { domc } from "./organelle";
import { Particle } from "../particle";
import { P } from "./organelle.h";
import { CommonParticles } from "../common";

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
