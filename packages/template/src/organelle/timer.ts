import { sys } from "cessnalib";
import { particle, organelle } from "@euglena/core";
import { common } from "../particle";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import CreateParticleUnion = particle.CreateParticleUnion;

export type ReadTime = particle.Particle<"ReadTime">;
export type SetTime = particle.Particle<"SetTime", sys.type.Time>;

export type Time = particle.Particle<"Time", sys.type.Time>;
export type Timer = extendOrganelleInteractions<{
    in: [[ReadTime, Time], [SetTime, common.ACK]];
    out: [Time];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<Timer>>;
export const cp = createParticle;
