import { particle, organelle } from "@euglena/core";
import { common } from "../particle";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import Particle = particle.Particle;
import CreateParticleUnion = particle.CreateParticleUnion;

export type TransmitParticle = particle.Particle<"TransmitParticle", { target: string; particle: Particle }>;
export type TransmitResponse = particle.Particle<"TransmitResponse", Particle | void>;

export type EndoplasmicReticulum = extendOrganelleInteractions<{
    in: [[TransmitParticle, any], common.OrganelleInfo];
    out: [common.Log, common.EuglenaHasBeenBorn];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<EndoplasmicReticulum>>;
export const cp = createParticle;
