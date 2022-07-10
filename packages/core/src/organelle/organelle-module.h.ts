import {
    AllOrganelleParticles,
    InComingParticle,
    OutGoingParticle,
    Sap,
    P,
} from "./particles.h";
import { CreateOrganelle, CreateSingletonOrganelle, CreateEndoplasmicReticulum } from "./create-organelle.h";
import { Particle } from "../particle";

export interface OrganelleModule<S extends Sap, COP extends AllOrganelleParticles = AllOrganelleParticles> {
    /**
     * createOrganelle
     */
    co: CreateOrganelle<InComingParticle<COP>, OutGoingParticle<COP>>;
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
    co: CreateSingletonOrganelle<InComingParticle<COP>, OutGoingParticle<COP>>;
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
    co: CreateEndoplasmicReticulum<InComingParticle<COP>, OutGoingParticle<COP>>;
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
