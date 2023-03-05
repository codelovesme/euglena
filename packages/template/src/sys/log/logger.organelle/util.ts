import { particle, organelle } from "@euglena/core";
import { Logger } from "./logger.organelle.h";

import ComingParticles = organelle.ComingParticles;
import CreateParticleUnion = particle.CreateParticleUnion;


export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<Logger>>;
export const cp = createParticle;