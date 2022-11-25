import { sys } from "cessnalib";
import { AllInteractions, Meta, Particle, cp as _cp, ComingParticles, CreateParticleUnion } from "@euglena/core";
import { common } from "../particle";

export type Count = "all" | number;
export type ReadParticle<P extends Particle = Particle> = Particle<
    "ReadParticle",
    {
        query: sys.type.RecursivePartial<P>;
        count: Count;
    }
>;
export type SaveParticle<P extends Particle = Particle> = Particle<
    "SaveParticle",
    | {
          particle: P;
          query?: sys.type.RecursivePartial<P>;
          count: Count;
      }
    | P[]
>;
export type RemoveParticle<P extends Particle = Particle> = Particle<"RemoveParticle", { query: sys.type.RecursivePartial<P>; count: Count }>;
export type Metas = Particle<"Metas", Meta[]>;
export type Hibernate = Particle<"Hibernate">;

export type Vacuole = AllInteractions<{
    in: [
        [SaveParticle, common.ACK | common.Exception],
        [ReadParticle, Particle<"Particles", Particle[]> | common.Exception],
        [RemoveParticle, common.ACK | common.Exception],
        [common.GetAlive, common.ACK | common.Exception],
        Hibernate
    ];
    out: [common.Log];
}>;

export const createParticle = _cp as CreateParticleUnion<ComingParticles<Vacuole>>;
export const cp = createParticle;
