import { particle, organelle } from "@euglena/core";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import CreateParticleUnion = particle.CreateParticleUnion;

export type Hash = particle.Particle<"Hash", string>;
export type Compare = particle.Particle<
    "Compare",
    {
        plainPassword: string;
        hashedPassword: string;
    }
>;
export type HashedPassword = particle.Particle<"HashedPassword", string>;
export type CompareResult = particle.Particle<"CompareResult", boolean>;

export type Bcrypt = extendOrganelleInteractions<{
    in: [[Hash, HashedPassword], [Compare, CompareResult]];
    out: [];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<Bcrypt>>;
export const cp = createParticle;
