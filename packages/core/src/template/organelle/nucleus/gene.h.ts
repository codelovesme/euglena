import { sys } from "cessnalib";
import { Particle } from "../../../particle";
import { NucleusTransmit } from "../../../organelle/organelle-receive.h";
import * as templateModule from "../../../template";
import * as particleModule from "../../../particle";

export type TemplateModule = typeof templateModule;
export type ParticleModule = typeof particleModule;

export type Organelles = { [organelleName: string]: string };

export interface GeneReaction<TriggerParticle extends Particle = Particle, O extends Organelles = Organelles> {
    (
        particle: TriggerParticle,
        source: string,
        tools: {
            /**
             * OrganelleTransmit
             */
            t: NucleusTransmit;
            /**
             *Send particle to specific organelle
             */
            to: {
                [P in keyof O]: <P extends Particle = Particle, Resp extends Particle | void = Particle | void>(
                    particle: P
                ) => ReturnType<NucleusTransmit<P, Resp>>;
            };
            /**
             * Specify the referenced organelle names
             */
            o: O;
            /**
             * @euglena/core
             */
            template: TemplateModule;
            particle: ParticleModule;
        }
    ): Promise<Particle | void>;
}

export type Gene<TriggerParticle extends Particle = Particle, O extends Organelles = Organelles> = Particle<
    "Gene",
    {
        name: string;
        triggers: sys.type.RecursivePartial<TriggerParticle>;
        reaction: GeneReaction<TriggerParticle, O>;
        organelles: O;
        override?: string;
    }
>;

export interface Chromosome extends Array<Gene> {}
export interface CreateChromosome {
    (bind: (addGene: AddGene<Particle>) => void): Chromosome;
}
export interface GeneOptionals {
    override?: string;
    expireAt?: number;
}
export interface AddGene<ParticleUnion extends Particle> {
    <TriggerParticle extends ParticleUnion>(
        name: string,
        triggers: sys.type.RecursivePartial<TriggerParticle>,
        reaction: GeneReaction<TriggerParticle>,
        geneOptionals?: GeneOptionals
    ): void;
}
