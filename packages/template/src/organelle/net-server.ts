import { AllInteractions, Log, Particle } from "@euglena/core";
import { GetAlive } from "../particle";

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
    out: [[Impulse, Impulse], Log];
}>;
