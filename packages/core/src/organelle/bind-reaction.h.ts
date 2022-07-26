import { AllOrganelleParticles, ComingParticleNameUnion } from "./particle";
import { OrganelleReaction, NucleusReaction, EndoplasmicReticulumReaction } from "./reaction.h";
import { SingletonOrganelleName } from "./singleton-organelle.h";
import { SapInteraction, InsertSapIntoParticles } from "./utils";

export type BindOrganelleReactions<COP extends AllOrganelleParticles> = {
    [CPN in ComingParticleNameUnion<COP>]: OrganelleReaction<COP, CPN>;
};

export type BindNucleusReactions<COP extends AllOrganelleParticles> = {
    [P in ComingParticleNameUnion<COP>]: NucleusReaction<COP, P>;
};

export type BindReticulumReactions<COP extends AllOrganelleParticles> = {
    [P in ComingParticleNameUnion<COP>]: EndoplasmicReticulumReaction<COP, P>;
};
export type BindSingletonOrganelleReactions<
    OrganelleName extends SingletonOrganelleName,
    COP extends AllOrganelleParticles,
    I extends SapInteraction
> = OrganelleName extends "EndoplasmicReticulum"
    ? BindReticulumReactions<InsertSapIntoParticles<COP, I>>
    : BindNucleusReactions<InsertSapIntoParticles<COP, I>>;
