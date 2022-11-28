import { CreateChromosome, Chromosome, DefineCreateGene, CreateGene, Gene } from "./gene.h";
import { particle } from "@euglena/core";

export const createGene: CreateGene = (name, triggers, reaction, organelles, override) =>
    particle.cp<Gene>("Gene", {
        name,
        triggers,
        reaction: reaction as any,
        organelles,
        override
    });

export const createChromosome: CreateChromosome = (bind) => {
    const chromosome: Chromosome = [];
    bind((name, triggers, reaction, organelles, override) => {
        chromosome.push(createGene(name, triggers, reaction, organelles, override));
    });
    return chromosome;
};

export const defineCreateGene: DefineCreateGene = (name, triggers, reaction, override) => (organelles) =>
    createGene(name, triggers, reaction, organelles, override);

export const cg = createGene;
export const cc = createChromosome;
export const dcg = defineCreateGene;
