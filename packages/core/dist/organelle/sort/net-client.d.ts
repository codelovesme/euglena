import { Particle } from "../../particle";
import { P } from "../particles.h";
import { CommonParticles } from "../../common";
declare const netClient: {
    v1: import("..").CreateOrganelleModuleInterface<{
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
    }, undefined>;
};
export { netClient };
