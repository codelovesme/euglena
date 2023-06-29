import { Particle } from "@euglena/core";
import { CreateChromosome, CreateGene, DefineCreateGene } from "./gene.par.h";
export declare const createGene: CreateGene;
export declare const createChromosome: CreateChromosome;
export declare const defineCreateGene: DefineCreateGene;
export declare const createTriggerByClass: <T extends string>(particleClass: T) => Partial<Particle<T, any, {}>>;
export declare const cg: CreateGene;
export declare const cc: CreateChromosome;
export declare const dcg: DefineCreateGene;
//# sourceMappingURL=gene.u.d.ts.map