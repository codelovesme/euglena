import { AllInteractions, Log, Particle } from "@euglena/core";

export type ReceiveParticle = Particle<"ReceiveParticle", { particle: Particle; source: string }>;

export type Nucleus = AllInteractions<{
    in: [[ReceiveParticle, Particle<string, any>]];
    out: [Log];
}>;
