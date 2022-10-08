import { CreateParticleUnion, Particle } from "../types";
import { cp } from "./particle";

export const defineCreateParticle = <ParticleUnion extends Particle>() => cp as CreateParticleUnion<ParticleUnion>;
export const dcp = defineCreateParticle;