import { cp as _cp, CreateParticleUnion } from "@euglena/core";
import { AuthParticle } from "./auth-particle.h";

export const createParticle = _cp as CreateParticleUnion<AuthParticle>;
export const cp = createParticle;
