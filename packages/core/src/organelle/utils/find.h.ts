import { Particle } from "../../particle";
import { Interaction } from "../particle";

export type FindInteraction<
    InteractionUnion extends Interaction,
    Class extends string
> = InteractionUnion extends Interaction<Particle<Class>> ? InteractionUnion : never;

export type FindParticle<ParticleUnion extends Particle, Class extends string> = ParticleUnion extends Particle<Class>
    ? ParticleUnion
    : never;
