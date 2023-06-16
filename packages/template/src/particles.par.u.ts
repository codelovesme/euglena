import { Particle, isParticleClass } from "@euglena/core";
import { Particles } from "./particles.par.h";

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