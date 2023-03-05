import * as core from "@euglena/core";
import { Exception } from "./exception.particle.h";

import Particle = core.particle.Particle;

const isParticleClass = core.particle.isParticleClass;

export const isException = (particle: Particle): particle is Exception => {
    return isParticleClass(particle,"Exception");
};
