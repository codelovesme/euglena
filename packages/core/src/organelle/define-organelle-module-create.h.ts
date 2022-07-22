import { SingletonOrganelleName } from "./singleton-organelle.h";
import { AllOrganelleParticles, InsertSapIntoParticles, SapInteraction, ToP, InComingParticle } from "./particles.h";
import { BindOrganelleReactions } from "./bind-reaction.h";
import { EndoplasmicReticulumModule, OrganelleModule, SingletonOrganelleModule } from "./organelle-module.h";
import { BindSingletonOrganelleReactions } from "./bind-reaction.h";
import { Particle } from "../particle";

export interface CreateOrganelleModuleInterface<
    COP extends AllOrganelleParticles,
    OrganelleName extends SingletonOrganelleName | undefined = undefined
> {
    /**
     * createOrganelleModule
     */
    com: OrganelleName extends undefined
        ? <I extends SapInteraction>(
              bindReactions: BindOrganelleReactions<InsertSapIntoParticles<COP, I>>
          ) => OrganelleModule<ToP<I[0]>, InsertSapIntoParticles<COP, I>>
        : OrganelleName extends "EndoplasmicReticulum"
        ? <I extends SapInteraction>(
              bindReactions: BindSingletonOrganelleReactions<OrganelleName, COP, I>
          ) => EndoplasmicReticulumModule<ToP<I[0]>, InsertSapIntoParticles<COP, I>>
        : <I extends SapInteraction>(
              bindReactions: BindSingletonOrganelleReactions<
                  Exclude<OrganelleName, undefined | "EndoplasmicReticulum">,
                  COP,
                  I
              >
          ) => SingletonOrganelleModule<ToP<I[0]>, InsertSapIntoParticles<COP, I>>;
    /**
     * createParticles
     */
    cps: <Class extends string>(class_: Class, opt: ToP<InComingParticle<COP, Class>>) => Particle<Class>;

}

export interface DefineOrganelleModuleCreate {
    <COP extends AllOrganelleParticles>(): CreateOrganelleModuleInterface<COP>;
    <COP extends AllOrganelleParticles, OrganelleName extends SingletonOrganelleName>(
        organelleName: OrganelleName
    ): CreateOrganelleModuleInterface<COP, OrganelleName>;
}
