import { ComingParticleUnion, CreateParticleUnion, cp } from "@euglena/core";
import { Thermometer } from "./thermometer.org.h";

export const createParticle = cp as CreateParticleUnion<ComingParticleUnion<Thermometer>>;