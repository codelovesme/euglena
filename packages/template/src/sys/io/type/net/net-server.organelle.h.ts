import { particle, organelle } from "@euglena/core";
import { common } from "../particle";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import Particle = particle.Particle;
import CreateParticleUnion = particle.CreateParticleUnion;



export type NetServer = extendOrganelleInteractions<{
    in: [common.GetAlive];
    out: [[Impulse, common.Particles], common.Log];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<NetServer>>;
export const cp = createParticle;
