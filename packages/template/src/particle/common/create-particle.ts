import { cp as _cp, CreateParticleUnion } from "@euglena/core";
import { CommonParticle } from "./common-particle.h";

export const createParticle = _cp as CreateParticleUnion<CommonParticle>;
export const cp = createParticle;