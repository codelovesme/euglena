import { ComingParticleUnion, CreateParticleUnion, cp } from "@euglena/core";
import { Timer } from "./timer.org.h";

export const createParticle = cp as CreateParticleUnion<ComingParticleUnion<Timer>>;
