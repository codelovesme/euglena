import { AddGene, GeneOptionals, GeneReaction, CreateChromosome, Chromosome } from "./gene.h";
import { createMeta, Particle, Meta } from "@euglena/particle";
import { sys } from "cessnalib";

export const createChromosome: CreateChromosome = (bind: (addGene: AddGene<Particle>) => void): Chromosome => {
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
                adds && adds.override
                    ? { name, triggers, reaction, override: adds.override }
                    : { name, triggers, reaction };
            geneCluster.push({ meta, data });
        }
    );
    return geneCluster;
};

/**
 * Alias for createChromosome
 */
export const cc = createChromosome;
