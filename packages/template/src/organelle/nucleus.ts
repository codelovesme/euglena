import { AllInteractions, Particle } from "@euglena/core";
import { Log, Particles } from "../particle/particle.h";

export type Namespace = "Nucleus";

export type ReceiveParticle = Particle<
    "ReceiveParticle",
    { particle: Particle; source: string },
    { namespace: Namespace }
>;

export type Nucleus = AllInteractions<{
    in: [[ReceiveParticle, Particles]];
    out: [Log];
}>;