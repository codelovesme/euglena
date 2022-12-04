import { particle, organelle } from "@euglena/core";
import { common } from "../particle";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import CreateParticleUnion = particle.CreateParticleUnion;

export type Logger = extendOrganelleInteractions<{
    in: [[common.Log, common.ACK]];
    out: [];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<Logger>>;
export const cp = createParticle;