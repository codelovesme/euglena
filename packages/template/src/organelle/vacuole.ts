import { sys } from "cessnalib";
import { particle, organelle } from "@euglena/core";
import { common } from "../particle";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import Particle = particle.Particle;
import CreateParticleUnion = particle.CreateParticleUnion;

export type Count = "all" | number;
export type ReadParticle<P extends Particle = Particle> = particle.Particle<
    "ReadParticle",
    {
        query: sys.type.RecursivePartial<P>;
        count: Count;
    }
>;
export type SaveParticle<P extends Particle = Particle> = particle.Particle<
    "SaveParticle",
    | {
          particle: P;
          query?: sys.type.RecursivePartial<P>;
          count: Count;
      }
    | P[]
>;
export type RemoveParticle<P extends Particle = Particle> = particle.Particle<"RemoveParticle", { query: sys.type.RecursivePartial<P>; count: Count }>;
export type Metas = particle.Particle<"Metas", particle.Meta[]>;
export type Hibernate = particle.Particle<"Hibernate">;

export type Vacuole = extendOrganelleInteractions<{
    in: [
        [SaveParticle, common.ACK | common.Exception],
        [ReadParticle, Particle<"Particles", Particle[]> | common.Exception],
        [RemoveParticle, common.ACK | common.Exception],
        [common.GetAlive, common.ACK | common.Exception],
        Hibernate
    ];
    out: [common.Log];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<Vacuole>>;
export const cp = createParticle;
