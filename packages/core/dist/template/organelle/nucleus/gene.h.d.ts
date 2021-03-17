import { sys } from "cessnalib";
import { Particle } from "../../../particle";
import { NucleusTransmit } from "../../../organelle/organelle-receive.h";
export interface GeneReaction<TriggerParticle extends Particle = Particle> {
    (particle: TriggerParticle, source: string, tools: {
        /**
         * OrganelleTransmit
         */
        t: NucleusTransmit;
    }): Promise<Particle | void>;
}
export interface Gene<TriggerParticle extends Particle = Particle> extends Particle<"Gene"> {
    data: {
        name: string;
        triggers: sys.type.RecursivePartial<TriggerParticle>;
        reaction: GeneReaction<TriggerParticle>;
        override?: string;
    };
}
export interface Chromosome extends Array<Gene> {
}
export interface CreateChromosome {
    (bind: (addGene: AddGene<Particle>) => void): Chromosome;
}
export interface GeneOptionals {
    override?: string;
    expireAt?: number;
}
export interface AddGene<ParticleUnion extends Particle> {
    <TriggerParticle extends ParticleUnion>(name: string, triggers: sys.type.RecursivePartial<TriggerParticle>, reaction: GeneReaction<TriggerParticle>, geneOptionals?: GeneOptionals): void;
}
