import { InComingParticleNameUnion, AllOrganelleParticles, P, InsertSingletonSapIntoParticles } from "./particles.h";
import { OrganelleReaction, NucleusReaction, EndoplasmicReticulumReaction } from "./reaction.h";
import { SingletonOrganelleName } from "./singleton-organelle.h";

export type BindOrganelleReactions<COP extends AllOrganelleParticles> = {
    [P in InComingParticleNameUnion<COP>]: OrganelleReaction<COP, P>;
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
    S extends P
> = OrganelleName extends "EndoplasmicReticulum"
    ? BindReticulumReactions<InsertSingletonSapIntoParticles<COP, S>>
    : BindNucleusReactions<InsertSingletonSapIntoParticles<COP, S>>;
