import {
    AllOrganelleParticles,
    InComingParticle,
    OutGoingParticle,
    CreateOrganelleParticles,
    Sap,
    P
} from "./particles.h";
import { CreateOrganelle, CreateSingletonOrganelle, CreateEndoplasmicReticulum } from "./create-organelle.h";

export interface OrganelleModule<S extends Sap, COP extends AllOrganelleParticles = AllOrganelleParticles> {
    /**
     * createOrganelle
     */
    co: CreateOrganelle<InComingParticle<COP>, OutGoingParticle<COP>>;
    /**
     * createParticles
     */
    cs: CreateOrganelleParticles<{ Sap: S }>["Sap"];
}

export interface SingletonOrganelleModule<S extends P, COP extends AllOrganelleParticles = AllOrganelleParticles> {
    /**
     * createOrganelle
     */
    co: CreateSingletonOrganelle<InComingParticle<COP>, OutGoingParticle<COP>>;
    /**
     * createParticles
     */
    cs: CreateOrganelleParticles<{ Sap: S }>["Sap"];
}

export interface EndoplasmicReticulumModule<S extends P, COP extends AllOrganelleParticles = AllOrganelleParticles> {
    /**
     * createOrganelle
     */
    co: CreateEndoplasmicReticulum<InComingParticle<COP>, OutGoingParticle<COP>>;
    /**
     * createParticles
     */
    cs: CreateOrganelleParticles<{ Sap: S }>["Sap"];
}
