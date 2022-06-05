import { AddGene, GeneOptionals, GeneReaction, CreateChromosome, Chromosome, Gene, Dependencies } from "./gene.h";
import { sys } from "cessnalib";
import { Particle, createMeta, Meta, cp } from "../../../particle";

export const createChromosome: CreateChromosome = (bind: (addGene: AddGene<Particle>) => void): Chromosome => {
    const geneCluster: Chromosome = [];
    bind(
        <TriggerParticle extends Particle = Particle>(
            name: string,
            triggers: sys.type.RecursivePartial<TriggerParticle>,
            reaction: GeneReaction<TriggerParticle>,
            adds?: GeneOptionals
        ) => {
            const meta: Meta<"Gene"> =
                adds && adds.expireAt ? createMeta("Gene", { expireAt: adds.expireAt }) : createMeta("Gene");
            const data: any = { name, triggers, reaction, override: adds?.override };
            geneCluster.push({ meta, data });
        }
    );
    return geneCluster;
};

export const defineGene =
    <P extends Particle, D extends Dependencies = Dependencies>(
        name: string,
        triggers: sys.type.RecursivePartial<P>,
        reaction: GeneReaction<P, D>,
        override?: string
    ) =>
    (dependencies: D): Gene<P,D> =>
        cp("Gene", {
            name,
            reaction,
            triggers,
            override,
            dependencies
        });

/**
 * createChromosome
 */
export const cc = createChromosome;
export const dg = defineGene;
