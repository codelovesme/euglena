import { AllInteractions, ComingParticleNameUnion } from "./particle";
import { OrganelleReaction } from "./reaction.h";

export type BindOrganelleReactions<COP extends AllInteractions> = {
    [CPN in ComingParticleNameUnion<COP>]: OrganelleReaction<COP, CPN>;
};

// export type BindNucleusReactions<COP extends AllInteractions> = {
//     [P in ComingParticleNameUnion<COP>]: NucleusReaction<COP, P>;
// };

// export type BindReticulumReactions<COP extends AllInteractions> = {
//     [P in ComingParticleNameUnion<COP>]: EndoplasmicReticulumReaction<COP, P>;
// };
// export type BindSingletonOrganelleReactions<
//     OrganelleName extends SingletonOrganelleName,
//     COP extends AllInteractions,
//     I extends Interaction
// > = OrganelleName extends "EndoplasmicReticulum"
//     ? BindReticulumReactions<InsertSapIntoParticles<COP, I>>
//     : BindNucleusReactions<InsertSapIntoParticles<COP, I>>;
