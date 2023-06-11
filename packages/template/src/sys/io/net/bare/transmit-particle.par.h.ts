import { Particle } from "@euglena/core";

export type TransmitParticle = Particle<
    "TransmitParticle",
    {
        particle: Particle;
        target: {
            host: string;
            port: number;
        };
    }
>;