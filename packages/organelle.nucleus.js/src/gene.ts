import {
    AddGene,
    GeneOptionals,
    GeneReaction,
    CreateChromosome,
    Chromosome,
    Gene,
    Dependencies,
    Organelles,
    Parameters
} from "./gene.h";
import { sys } from "cessnalib";
import { Particle, createMeta, Meta, cp } from "@euglena/core";

export const createChromosome: CreateChromosome = (bind: (addGene: AddGene<Particle>) => void): Chromosome => {
    const geneCluster: Chromosome = [];
    bind(
        <
            TriggerParticle extends Particle = Particle,
            O extends Organelles = Organelles,
            P extends Parameters = Parameters
        >(
            name: string,
            triggers: sys.type.RecursivePartial<TriggerParticle>,
            reaction: GeneReaction<TriggerParticle, O, P>,
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
    <P extends Particle, O extends Organelles, P_ extends Parameters>(
        name: string,
        triggers: sys.type.RecursivePartial<P>,
        reaction: GeneReaction<P, O, P_>,
        override?: string
    ) =>
    (dependencies: Dependencies<O, P_>): Gene<P, O, P_> =>
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
