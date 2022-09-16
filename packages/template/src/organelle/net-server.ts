import { AllInteractions, Log, Particle } from "@euglena/core";
import { GetAlive, Particles } from "../utils/particles";

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
