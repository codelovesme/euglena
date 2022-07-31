import { Particle } from "../particle.h";
import { AllInteractions } from "./all-interactions.h";
import { Interaction } from "./interaction.h";
import { FindInteraction } from "./utils";

export type TriggerParticleFromInteraction<I extends Interaction> = I extends Particle[] ? I[0] : I;
export type ResponseParticleFromInteraction<I extends Interaction> = I extends [
    Particle,
    Particle
]
    ? I[1]
    : never;

export type ComingParticleNameUnion<COP extends AllInteractions> = TriggerParticleFromInteraction<
    COP["in"][number]
>["meta"]["class"];

export type ComingResponseParticleNameUnion<COP extends AllInteractions> = ResponseParticleFromInteraction<
    COP["in"][number]
>["meta"]["class"];

export type ComingParticle<
    COP extends AllInteractions,
    N extends ComingParticleNameUnion<COP>
> = TriggerParticleFromInteraction<FindInteraction<COP["in"][number], N>>;

export type ComingParticles<COP extends AllInteractions> = TriggerParticleFromInteraction<COP["in"][number]>;

export type ComingResponseParticle<
    COP extends AllInteractions,
    N extends ComingParticleNameUnion<COP> = ComingParticleNameUnion<COP>
> = ResponseParticleFromInteraction<FindInteraction<COP["in"][number], N>>;

export type GoingParticleNameUnion<COP extends AllInteractions> = TriggerParticleFromInteraction<
    COP["out"][number]
>["meta"]["class"];

export type GoingResponseParticleNameUnion<COP extends AllInteractions> = ResponseParticleFromInteraction<
    COP["out"][number]
>["meta"]["class"];

export type GoingParticle<
    COP extends AllInteractions,
    N extends GoingParticleNameUnion<COP>
> = TriggerParticleFromInteraction<FindInteraction<COP["out"][number], N>>;

export type GoingParticles<COP extends AllInteractions> = TriggerParticleFromInteraction<COP["out"][number]>;

export type GoingResponseParticle<
    COP extends AllInteractions,
    N extends GoingParticleNameUnion<COP> = GoingParticleNameUnion<COP>
> = ResponseParticleFromInteraction<FindInteraction<COP["out"][number], N>>;

import "./in-out-particle.h.spec"