import { AllInteractions, Particle } from "@euglena/core";
import { GetAlive, Log, Particles } from "../particle/particle.h";

export type Impulse = Particle<
    "Impulse",
    {
        particle: Particle;
        source: string;
        token?: string;
    }
>;

export type NetServer = AllInteractions<{
    in: [GetAlive];
    out: [[Impulse, Particles], Log];
}>;
