import { sys } from "cessnalib";
import {
    Particle,
    AllInteractions,
    UnionToIntersection,
    ComingParticleNameUnion,
    ComingParticle,
    ComingResponseParticle
} from "@euglena/core";
import * as coreModule from "@euglena/core";
import * as templateModule from "../../index";
import * as cessnalib from "cessnalib";

export type TemplateModule = typeof templateModule;
export type CoreModule = typeof coreModule;
export type Cessnalib = typeof cessnalib;

type _Organelle = { [organelleName: string]: AllInteractions };
export type Organelles<T extends _Organelle = _Organelle> = T;

type _Parameters = { [key: string]: string | number | boolean };
export type Parameters<T extends _Parameters = _Parameters> = T;

export type Stringify<O extends Organelles> = { [P in keyof O]: string };
export type Dependencies<O extends Organelles = Organelles, P extends Parameters = Parameters> = {
    organelles: Stringify<O>;
    parameters: P;
};

export type GeneTransmitInner<O extends string, COP extends AllInteractions> = UnionToIntersection<
    {
        [P in ComingParticleNameUnion<COP>]: (
            particle: ComingParticle<COP, P>,
            organelleName: O
        ) => Promise<ComingResponseParticle<COP> extends undefined ? void : ComingResponseParticle<COP, P>>;
    }[ComingParticleNameUnion<COP>]
>;

export type GeneTransmit<T extends { [x: string]: AllInteractions }> = UnionToIntersection<
    {
        [P in keyof T]: GeneTransmitInner<Exclude<P, number | symbol>, T[P]>;
    }[keyof T]
>;

export interface GeneReaction<TriggerParticle extends Particle, O extends Organelles, P extends Parameters> {
    (
        particle: TriggerParticle,
        source: string,
        tools: {
            /**
             * OrganelleTransmit
             */
            t: GeneTransmit<O>;
            /**
             * Organelle names
             */
            o: Stringify<O>;
            /**
             * Parameters
             */
            params: P;
        }
    ): Promise<Particle | void>;
}

export type Gene<
    TriggerParticle extends Particle = Particle,
    O extends Organelles = Organelles,
    P extends Parameters = Parameters
> = Particle<
    "Gene",
    {
        name: string;
        triggers: sys.type.RecursivePartial<TriggerParticle>;
        reaction: GeneReaction<TriggerParticle, O, P>;
        dependencies: Dependencies<O, P>;
        override?: string;
        expireAt?: number;
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
    <TriggerParticle extends ParticleUnion, O extends Organelles, P extends Parameters>(
        name: string,
        triggers: sys.type.RecursivePartial<TriggerParticle>,
        reaction: GeneReaction<TriggerParticle, O, P>,
        geneOptionals?: GeneOptionals
    ): void;
}
