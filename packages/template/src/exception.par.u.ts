import { CreateParticle, Particle, cp, isParticleClass } from "@euglena/core";
import { Exception } from "./exception.par.h";

export const isException = (particle: Particle): particle is Exception => {
    return isParticleClass(particle, "Exception");
};

export const createException = cp as CreateParticle<Exception>;