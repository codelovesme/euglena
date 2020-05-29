import { AllOrganelleParticles, CreateAllOrganelleParticles, InComingParticle, OutGoingParticle } from "./particles.h";
import { CreateOrganelle, CreateSingletonOrganelle, CreateEndoplasmicReticulum } from "./create-organelle.h";
export interface OrganelleModule<COP extends AllOrganelleParticles = AllOrganelleParticles> {
    /**
     * createOrganelle
     */
    co: CreateOrganelle<InComingParticle<COP>, OutGoingParticle<COP>>;
    /**
     * createParticles
     */
    cp: CreateAllOrganelleParticles<COP>;
}
export interface SingletonOrganelleModule<COP extends AllOrganelleParticles = AllOrganelleParticles> {
    /**
     * createOrganelle
     */
    co: CreateSingletonOrganelle<InComingParticle<COP>, OutGoingParticle<COP>>;
    /**
     * createParticles
     */
    cp: CreateAllOrganelleParticles<COP>;
}
export interface EndoplasmicReticulumModule<COP extends AllOrganelleParticles = AllOrganelleParticles> {
    /**
     * createOrganelle
     */
    co: CreateEndoplasmicReticulum<InComingParticle<COP>, OutGoingParticle<COP>>;
    /**
     * createParticles
     */
    cp: CreateAllOrganelleParticles<COP>;
}
