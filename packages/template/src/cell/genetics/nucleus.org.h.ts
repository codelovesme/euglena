import { Particle, createOrganelleInteractions } from "@euglena/core";
import { ReceiveParticle } from "./receive-particle.par.h";
import { GetGenes } from "./get-genes.par.h";
import { Gene } from "./gene.par.h";
import { log } from "../../sys";
import { Particles } from "../../particles.par.h";

export type Nucleus = createOrganelleInteractions<{
    in: [[ReceiveParticle, Particle], [GetGenes, Particles<Gene>]];
    out: [log.Log];
}>;
