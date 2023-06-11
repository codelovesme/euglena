import { ComingParticleUnion, CreateParticleUnion, cp } from "@euglena/core";
import { Nucleus } from "./nucleus.org.h";

export const createNucleusComingParticle = cp as CreateParticleUnion<ComingParticleUnion<Nucleus>>;
