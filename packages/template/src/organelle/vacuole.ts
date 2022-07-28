import { AllInteractions, Exception, Particle } from "@euglena/core";
import { GetAlive, Hibernate, Log, Metas, ReadParticle, RemoveParticle, SaveParticle } from "../particle";

export type Vacuole = AllInteractions<{
    in: [[SaveParticle, Metas], [ReadParticle, Particle<"Particles", Particle[]>], RemoveParticle, GetAlive, Hibernate];
    out: [Log, Exception];
}>;
