import { FindInteraction } from "../utils";
import { AllOrganelleParticles } from "./all-organelle-particle.h";

export type ComingParticleNameUnion<COP extends AllOrganelleParticles> = COP["in"][number][0]["meta"]["class"];
export type ComingResponseParticleNameUnion<COP extends AllOrganelleParticles> = Exclude<
    COP["in"][number][1],
    undefined
>["meta"]["class"];

export type ComingParticle<
    COP extends AllOrganelleParticles,
    N extends ComingParticleNameUnion<COP>
> = FindInteraction<COP["in"][number], N>[0];

export type ComingParticles<
    COP extends AllOrganelleParticles,
> = COP["in"][number][0];

export type ComingResponseParticle<
    COP extends AllOrganelleParticles,
    N extends ComingParticleNameUnion<COP> = ComingParticleNameUnion<COP>
> = FindInteraction<COP["in"][number], N>[1];

export type GoingParticleNameUnion<COP extends AllOrganelleParticles> = COP["out"][number][0]["meta"]["class"];
export type GoingResponseParticleNameUnion<COP extends AllOrganelleParticles> = Exclude<
    COP["out"][number][1],
    undefined
>["meta"]["class"];

export type GoingParticle<
    COP extends AllOrganelleParticles,
    N extends GoingParticleNameUnion<COP>
> = FindInteraction<COP["out"][number], N>[0];

export type GoingParticles<
    COP extends AllOrganelleParticles,
>  = COP["out"][number][0];

export type GoingResponseParticle<
    COP extends AllOrganelleParticles,
    N extends GoingParticleNameUnion<COP> = GoingParticleNameUnion<COP>
> = FindInteraction<COP["out"][number], N>[1];