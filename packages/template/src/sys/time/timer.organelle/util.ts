import { particle, organelle } from "@euglena/core";
import { Timer } from "./timer.organelle.h";

import ComingParticles = organelle.ComingParticles;
import CreateParticleUnion = particle.CreateParticleUnion;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<Timer>>;
export const cp = createParticle;
