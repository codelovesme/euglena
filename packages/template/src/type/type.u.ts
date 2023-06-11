import { CreateParticleUnion, cp as _cp } from "@euglena/core";
import { TypeParticle } from "./type.h";

export const createParticle = _cp as CreateParticleUnion<TypeParticle>;
export const cp = createParticle;