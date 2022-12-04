import { particle, organelle } from "@euglena/core";
import { common } from "../particle";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import CreateParticleUnion = particle.CreateParticleUnion;

export type Event = particle.Particle<"Event">;
export type Render = particle.Particle<"Render">;

export type UI = extendOrganelleInteractions<{
    in: [[Render, common.ACK | common.Exception]];
    out: [common.Log, Event];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<UI>>;
export const cp = createParticle;
