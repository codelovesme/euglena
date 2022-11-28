import { particle } from "@euglena/core";
import { AuthParticle } from "./auth-particle.h";

export const createParticle = particle.cp as particle.CreateParticleUnion<AuthParticle>;
export const cp = createParticle;