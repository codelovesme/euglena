import { Particle } from "@euglena/core";

export type Impulse = Particle<
    "Impulse",
    {
        particle: Particle;
        source: string;
        token?: string;
    }
>;