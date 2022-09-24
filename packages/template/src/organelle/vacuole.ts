import { AllInteractions, Particle, Meta } from "@euglena/core";
import { sys } from "cessnalib";
import { ACK, Exception, GetAlive, Log } from "../particle/particle.h";

export type Count = "all" | number;
export type ReadParticle = Particle<
    "ReadParticle",
    {
        query: sys.type.RecursivePartial<Particle>;
        count: Count;
    }
>;
export type SaveParticle = Particle<
    "SaveParticle",
    | {
          particle: Particle;
          query?: sys.type.RecursivePartial<Particle>;
          count: Count;
      }
    | Particle[]
>;
export type RemoveParticle = Particle<"RemoveParticle", { query: sys.type.RecursivePartial<Particle>; count: Count }>;
export type Metas = Particle<"Metas", Meta[]>;
export type Hibernate = Particle<"Hibernate">;

export type Vacuole = AllInteractions<{
    in: [
        [SaveParticle, ACK | Exception],
        [ReadParticle, Particle<"Particles", Particle[]> | Exception],
        [RemoveParticle, ACK | Exception],
        [GetAlive, ACK | Exception],
        Hibernate
    ];
    out: [Log];
}>;
