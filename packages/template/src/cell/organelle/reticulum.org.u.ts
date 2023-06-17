import { ComingParticleUnion, CreateParticleUnion, cp } from "@euglena/core";
import { Reticulum } from "./reticulum.org.h";

export const createReticulumComingParticle = cp as CreateParticleUnion<ComingParticleUnion<Reticulum>>;
