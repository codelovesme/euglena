import { AllInteractions, Exception, Particle, Log, Meta } from "@euglena/core";
import { sys } from "cessnalib";

export type Count = "all" | number;
export type ReadParticle = Particle<
    "readParticle",
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
export type Metas = Particle<"Metas",Meta[]>;
export type Hibernate = Particle<"Hibernate">;

export type Vacuole = AllInteractions<{
    in: [[SaveParticle, Metas], [ReadParticle, Particle<"Particles", Particle[]>], RemoveParticle, GetAlive, Hibernate];
    out: [Log, Exception];
}>;
