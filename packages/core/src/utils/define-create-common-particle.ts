import { cp } from "@euglena/core/src/utils/particle";
import { CreateParticleUnion, Particle } from "../types";

export const defineCreateCommonParticles = <ParticleUnion extends Particle>() => cp as CreateParticleUnion<ParticleUnion>;
export const dccp = defineCreateCommonParticles;