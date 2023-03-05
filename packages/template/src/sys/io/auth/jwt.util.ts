import { particle, organelle } from "@euglena/core";
import { JWT } from "./jwt.organelle.h";

import ComingParticles = organelle.ComingParticles;
import CreateParticleUnion = particle.CreateParticleUnion;


export type EncryptedToken = particle.Particle<"EncryptedToken", string>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<JWT>>;
export const cp = createParticle;