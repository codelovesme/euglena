import * as core from "@euglena/core";
import { Particles } from "./particles.h";

import Particle = core.particle.Particle;

const isParticleClass = core.particle.isParticleClass;

export const getParticle = <P extends Particle>(
    particles: Particles,
    particleName: P["meta"]["class"]
): P | undefined => {
    return particles.data.find((x) => isParticleClass(x, particleName)) as P | undefined;
};

export const getFirstParticle = <P extends Particle>(
    particles: Particles<P>
): P | undefined => {
    return particles.data[0] as P | undefined;
};

import "./particles.spec";
