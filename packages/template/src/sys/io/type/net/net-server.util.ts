import { particle, organelle } from "@euglena/core";
import { NetServer } from "./net-server.organelle.h";

import ComingParticles = organelle.ComingParticles;
import CreateParticleUnion = particle.CreateParticleUnion;


export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<NetServer>>;
export const cp = createParticle;
