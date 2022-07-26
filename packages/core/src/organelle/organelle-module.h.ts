import { CreateOrganelle, CreateSingletonOrganelle, CreateEndoplasmicReticulum } from "./create-organelle.h";
import { Particle } from "../particle";
import { AllOrganelleParticles, ComingParticles, ComingResponseParticle } from "./particle";
import { Sap, P } from "./particles.h";

export interface OrganelleModule<S extends Sap, COP extends AllOrganelleParticles = AllOrganelleParticles> {
    /**
     * createOrganelle
     */
    co: CreateOrganelle<ComingParticles<COP>, ComingResponseParticle<COP>>;
    /**
     * createParticles
     */
    cs: <Class extends string>(
        class_: Class,
        data?: S["data"],
        adds?: S["adds"]
        //@ts-ignore
    ) => Particle<Class, typeof data, Exclude<typeof adds,undefined>>;
}

export interface SingletonOrganelleModule<S extends P, COP extends AllOrganelleParticles = AllOrganelleParticles> {
    /**
     * createOrganelle
     */
    co: CreateSingletonOrganelle<ComingParticles<COP>, ComingResponseParticle<COP>>;
    /**
     * createParticles
     */
    cs: <Class extends string>(
        class_: Class,
        data?: S["data"],
        adds?: S["adds"]
        //@ts-ignore
    ) => Particle<Class, typeof data, Exclude<typeof adds,undefined>>;
}

export interface EndoplasmicReticulumModule<S extends P, COP extends AllOrganelleParticles = AllOrganelleParticles> {
    /**
     * createOrganelle
     */
    co: CreateEndoplasmicReticulum<ComingParticles<COP>, ComingResponseParticle<COP>>;
    /**
     * createParticles
     */
    cs: <Class extends string>(
        class_: Class,
        data?: S["data"],
        adds?: S["adds"]
        //@ts-ignore
    ) => Particle<Class, typeof data, Exclude<typeof adds,undefined>>;
}
