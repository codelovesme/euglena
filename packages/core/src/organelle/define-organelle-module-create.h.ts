import { SingletonOrganelleName } from "./singleton-organelle.h";
import {
    AllOrganelleParticles,
    InsertSapIntoParticles,
    InComingParticleNameUnion,
    OutGoingParticleNameUnion,
    InsertSingletonSapIntoParticles,
    CreateAllOrganelleParticles,
    P,
    Sap
} from "./particles.h";
import { BindSingletonOrganelleReactions } from "./bind-reaction.h";
import { EndoplasmicReticulumModule, SingletonOrganelleModule, OrganelleModule } from "./organelle-module.h";
import { BindOrganelleReactions } from "./bind-reaction.h";

export interface CreateOrganelleModuleInterface<
    COP extends AllOrganelleParticles,
    OrganelleName extends SingletonOrganelleName | undefined = undefined
> {
    /**
     * createOrganelleModule
     */
    com: OrganelleName extends undefined
        ? <S extends Sap>(
              bindReactions: BindOrganelleReactions<InsertSapIntoParticles<COP, S>>
          ) => OrganelleModule<InsertSapIntoParticles<COP, S>>
        : OrganelleName extends "EndoplasmicReticulum"
        ? <S extends P>(
              bindReactions: BindSingletonOrganelleReactions<OrganelleName, COP, S>
          ) => EndoplasmicReticulumModule<InsertSingletonSapIntoParticles<COP, S>>
        : <S extends P>(
              bindReactions: BindSingletonOrganelleReactions<
                  Exclude<OrganelleName, undefined | "EndoplasmicReticulum">,
                  COP,
                  S
              >
          ) => SingletonOrganelleModule<InsertSingletonSapIntoParticles<COP, S>>;
    /**
     * createParticles
     */
    cp: CreateAllOrganelleParticles<COP>;
}

export interface DefineOrganelleModuleCreate {
    <COP extends AllOrganelleParticles>(
        incomingParticleNames: InComingParticleNameUnion<COP>[],
        outgoingParticleNames: OutGoingParticleNameUnion<COP>[]
    ): CreateOrganelleModuleInterface<COP>;
    <COP extends AllOrganelleParticles, OrganelleName extends "EndoplasmicReticulum" | "Nucleus">(
        incomingParticleNames: InComingParticleNameUnion<COP>[],
        outgoingParticleNames: OutGoingParticleNameUnion<COP>[],
        organelleName: OrganelleName
    ): CreateOrganelleModuleInterface<COP, OrganelleName>;
}
