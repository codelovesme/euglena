import { particle } from "@euglena/core";
import { CommonParticle } from "./common-particle.h";

export const createParticle = particle.cp as particle.CreateParticleUnion<CommonParticle>;
export const cp = createParticle;