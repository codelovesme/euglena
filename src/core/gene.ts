import {
  AddGene,
  GeneOptionals,
  GeneReaction,
  CreateChromosome,
  Chromosome,
  OutGoingParticleOfCOPM,
  CreateOrganelleParticlesMap,
  AlreadyAddedOrganelleMaps,
  AlreadyAddedOrganelleParticleUnion
} from "./gene.h";
import { Particle, Meta } from "./particle.h";
import { createMeta } from "./particle";
import { ParticleUnion } from "./organelle.h";
import { CreateCommonParticles } from "../template/common-particles.h";
import { sys } from "cessnalib";

export const createChromosome: CreateChromosome = <M extends CreateOrganelleParticlesMap>(
  createOrganelleParticlesMap: M,
  bind: (
    addGene: AddGene<
      | AlreadyAddedOrganelleParticleUnion
      | OutGoingParticleOfCOPM<M>
      | OutGoingParticleOfCOPM<AlreadyAddedOrganelleMaps>
      | ParticleUnion<CreateCommonParticles>,
      M & AlreadyAddedOrganelleMaps
    >
  ) => void
): Chromosome => {
  const geneCluster: Chromosome = [];
  bind(
    <TriggerParticle extends Particle>(
      name: string,
      triggers: sys.type.RecursivePartial<TriggerParticle>,
      reaction: GeneReaction<TriggerParticle>,
      adds: GeneOptionals
    ) => {
      const meta: Meta<"Gene"> =
        adds && adds.expireTime ? createMeta("Gene", { expireTime: adds.expireTime }) : createMeta("Gene");
      const data =
        adds && adds.override ? { name, triggers, reaction, override: adds.override } : { name, triggers, reaction };
      geneCluster.push({ meta, data });
    }
  );
  return geneCluster;
};

/**
 * Alias for createChromosome
 */
export const cc = createChromosome;
