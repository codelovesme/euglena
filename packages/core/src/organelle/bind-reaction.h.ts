import { InComingParticleNameUnion, AllOrganelleParticles, InsertSapIntoParticles, SapInteraction } from "./particles.h";
import { OrganelleReaction, NucleusReaction, EndoplasmicReticulumReaction } from "./reaction.h";
import { SingletonOrganelleName } from "./singleton-organelle.h";

export type BindOrganelleReactions<COP extends AllOrganelleParticles> = {
    [Class in InComingParticleNameUnion<COP>]: OrganelleReaction<COP, Class>;
};

export type BindNucleusReactions<COP extends AllOrganelleParticles> = {
    [P in InComingParticleNameUnion<COP>]: NucleusReaction<COP, P>;
};

export type BindReticulumReactions<COP extends AllOrganelleParticles> = {
    [P in InComingParticleNameUnion<COP>]: EndoplasmicReticulumReaction<COP, P>;
};
export type BindSingletonOrganelleReactions<
    OrganelleName extends SingletonOrganelleName,
    COP extends AllOrganelleParticles,
    I extends SapInteraction
> = OrganelleName extends "EndoplasmicReticulum"
    ? BindReticulumReactions<InsertSapIntoParticles<COP, I>>
    : BindNucleusReactions<InsertSapIntoParticles<COP, I>>;
