import { particle, organelle } from "@euglena/core";
import { common } from "../particle";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import CreateParticleUnion = particle.CreateParticleUnion;

export type Read = particle.Particle<"Read">;

export type Matter = particle.Particle<
    "Matter",
    Array<{
        pm: number;
        value: number;
        type: "Normal" | "Atmos" | "Count";
    }>
>;

export type MatterSensor = extendOrganelleInteractions<{
    in: [[Read, Matter]];
    out: [common.Log];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<MatterSensor>>;
export const cp = createParticle;
