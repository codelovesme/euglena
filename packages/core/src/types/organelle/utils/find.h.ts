import { Particle } from "../../particle.h";
import { Interaction } from "../interaction";

export type FindInteraction<
    InteractionUnion extends Interaction,
    Class extends string
> = InteractionUnion extends Interaction<Particle<Class, any>> ? InteractionUnion : never;

export type FindParticle<ParticleUnion extends Particle<string,any>, Class extends string> = ParticleUnion extends Particle<Class>
    ? ParticleUnion
    : never;
