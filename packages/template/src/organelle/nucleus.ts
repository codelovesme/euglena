import { particle, organelle } from "@euglena/core";
import { common } from "../particle";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import Particle = particle.Particle;
import CreateParticleUnion = particle.CreateParticleUnion;

export type ReceiveParticle = particle.Particle<"ReceiveParticle", { particle: Particle; source: string }>;

export type Nucleus = extendOrganelleInteractions<{
    in: [[ReceiveParticle, common.Particles]];
    out: [common.Log];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<Nucleus>>;
export const cp = createParticle;
