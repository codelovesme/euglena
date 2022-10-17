import { cp, isParticleClass, Particle } from "@euglena/core";
import { Particles } from "./particles.h";

export const findParticle = <P extends Particle>(
    particles: Particles,
    particleName: P["meta"]["class"]
): P | undefined => {
    return particles.data.find((x) => isParticleClass(x, particleName)) as P | undefined;
};

export const flatten = (particles: Particles): Particles => {
    return particles.data.reduce((acc, curr) => {
        const particles = isParticleClass(curr, "Particles") ? flatten(curr).data : [curr];
        return {
            ...acc,
            data: [...acc.data, ...particles]
        } as Particles;
    }, cp<Particles>("Particles", [])) as Particles;
};

import "./particles.spec";
