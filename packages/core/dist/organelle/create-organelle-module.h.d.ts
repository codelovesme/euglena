import { AllOrganelleParticles, CreateAllOrganelleParticles } from "./particles.h";
import { BindOrganelleReactions } from "./bind-reaction.h";
import { EndoplasmicReticulumModule, OrganelleModule, SingletonOrganelleModule } from "./organelle-module.h";
export interface CreateOrganelleModule {
    <COP extends AllOrganelleParticles>(createParticles: CreateAllOrganelleParticles<COP>, bindReactions: BindOrganelleReactions<COP>): OrganelleModule<COP>;
    <COP extends AllOrganelleParticles>(createParticles: CreateAllOrganelleParticles<COP>, bindReactions: BindOrganelleReactions<COP>, organelleName: "EndoplasmicReticulum"): EndoplasmicReticulumModule<COP>;
    <OrganelleName extends string, COP extends AllOrganelleParticles>(createParticles: CreateAllOrganelleParticles<COP>, bindReactions: BindOrganelleReactions<COP>, organelleName: OrganelleName): SingletonOrganelleModule<COP>;
}
