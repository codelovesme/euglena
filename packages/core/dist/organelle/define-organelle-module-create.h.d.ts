import { SingletonOrganelleName } from "./singleton-organelle.h";
import { AllOrganelleParticles, InComingParticleNameUnion, OutGoingParticleNameUnion, CreateAllOrganelleParticles, InsertSapIntoParticles, InsertSingletonSapIntoParticles, Sap, P } from "./particles.h";
import { BindOrganelleReactions } from "./bind-reaction.h";
import { EndoplasmicReticulumModule, OrganelleModule, SingletonOrganelleModule } from "./organelle-module.h";
import { BindSingletonOrganelleReactions } from "./bind-reaction.h";
export interface CreateOrganelleModuleInterface<COP extends AllOrganelleParticles, OrganelleName extends SingletonOrganelleName | undefined = undefined> {
    /**
     * createOrganelleModule
     */
    com: OrganelleName extends undefined ? <S extends Sap>(bindReactions: BindOrganelleReactions<InsertSapIntoParticles<COP, S>>) => OrganelleModule<S, InsertSapIntoParticles<COP, S>> : OrganelleName extends "EndoplasmicReticulum" ? <S extends P>(bindReactions: BindSingletonOrganelleReactions<OrganelleName, COP, S>) => EndoplasmicReticulumModule<S, InsertSingletonSapIntoParticles<COP, S>> : <S extends P>(bindReactions: BindSingletonOrganelleReactions<Exclude<OrganelleName, undefined | "EndoplasmicReticulum">, COP, S>) => SingletonOrganelleModule<S, InsertSingletonSapIntoParticles<COP, S>>;
    /**
     * createParticles
     */
    cp: CreateAllOrganelleParticles<COP>;
}
export interface DefineOrganelleModuleCreate {
    <COP extends AllOrganelleParticles>(incomingParticleNames: InComingParticleNameUnion<COP>[], outgoingParticleNames: OutGoingParticleNameUnion<COP>[]): CreateOrganelleModuleInterface<COP>;
    <COP extends AllOrganelleParticles, OrganelleName extends SingletonOrganelleName>(incomingParticleNames: InComingParticleNameUnion<COP>[], outgoingParticleNames: OutGoingParticleNameUnion<COP>[], organelleName: OrganelleName): CreateOrganelleModuleInterface<COP, OrganelleName>;
}
