import { CreateParticleUnion } from "../organelle";
import { cp } from "./particle";
import { Particle } from "./particle.h";

export const defineCreateParticle = <ParticleUnion extends Particle>() =>
    cp as CreateParticleUnion<ParticleUnion>;
export const dcp = defineCreateParticle;
