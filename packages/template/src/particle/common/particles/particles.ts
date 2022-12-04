import { particle } from "@euglena/core";
import { Particles } from "./particles.h";

export const getParticle = <P extends particle.Particle>(
    particles: Particles,
    particleName: P["meta"]["class"]
): P | undefined => {
    return particles.data.find((x) => particle.isParticleClass(x, particleName)) as P | undefined;
};

import "./particles.spec";
