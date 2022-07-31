import { AllInteractions, Log, Particle } from "@euglena/core";
import { Particles } from "../../particle";

export type ReceiveParticle = Particle<"ReceiveParticle", { particle: Particle; source: string }>;

export type Nucleus = AllInteractions<{
    in: [[ReceiveParticle, Particles]];
    out: [Log];
}>;
