import { particle, organelle } from "@euglena/core";
import { common } from "../particle";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import CreateParticleUnion = particle.CreateParticleUnion;

export type Listen = particle.Particle<"Listen">;
export type Temperature = particle.Particle<"Temperature">;

export type Thermometer = extendOrganelleInteractions<{
    in: [[Listen, common.ACK | common.Exception]];
    out: [Temperature, common.Log];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<Thermometer>>;
export const cp = createParticle;
