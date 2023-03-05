import { sys } from "cessnalib";
import { particle, organelle } from "@euglena/core";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import Particle = particle.Particle;
import CreateParticleUnion = particle.CreateParticleUnion;
import { ACK } from "../ack.particle.h";
import { Exception } from "../exception";

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
        [SaveParticle, ACK | Exception],
        [ReadParticle, Particle<"Particles", Particle[]> | Exception],
        [RemoveParticle, ACK | Exception],
        [GetAlive, ACK | Exception],
        Hibernate
    ];
    out: [Log];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<Vacuole>>;
export const cp = createParticle;
