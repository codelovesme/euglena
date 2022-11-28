import { sys, ts } from "cessnalib";
import { particle, organelle } from "@euglena/core";

import Particle = particle.Particle;
import OrganelleInteractions = organelle.OrganelleInteractions;
import IntersectionFromUnion = ts.IntersectionFromUnion;
import ComingParticleNameUnion = organelle.ComingParticleNameUnion;
import ComingParticle = organelle.ComingParticle;
import ComingResponseParticle = organelle.ComingResponseParticle;

export type Organelles = Record<string, OrganelleInteractions>;

export type extendOrganelles<I extends Organelles> = I;

export type Stringify<O extends Organelles> = { [P in keyof O]: string };

export type GeneTransmitInner<O extends string, COP extends OrganelleInteractions> = IntersectionFromUnion<
    {
        [P in ComingParticleNameUnion<COP>]: (
            particle: ComingParticle<COP, P>,
            organelleName: O
        ) => Promise<ComingResponseParticle<COP> extends undefined ? void : ComingResponseParticle<COP, P>>;
    }[ComingParticleNameUnion<COP>]
>;

export type GeneTransmit<O extends Organelles> = IntersectionFromUnion<
    {
        [P in keyof O]: GeneTransmitInner<Exclude<P, number | symbol>, O[P]>;
    }[keyof O]
>;

export interface GeneReaction<TriggerParticle extends Particle = Particle, O extends Organelles = Organelles> {
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
        }
    ): Promise<Particle | void>;
}

export type Gene<TriggerParticle extends Particle = Particle, O extends Organelles = Organelles> = particle.Particle<
    "Gene",
    {
        name: string;
        triggers: sys.type.RecursivePartial<TriggerParticle>;
        reaction: GeneReaction<TriggerParticle, O>;
        organelles: Stringify<O>;
        override?: string;
    }
>;

export type Chromosome = Gene[];

export type CreateGene = <P extends Particle, O extends Organelles>(
    name: string,
    triggers: sys.type.RecursivePartial<P>,
    reaction: GeneReaction<P, O>,
    organelles: Stringify<O>,
    override?: string
) => Gene;

export type CreateChromosome = (
    bind: (
        addGene: <P extends Particle, O extends Organelles>(
            name: string,
            triggers: sys.type.RecursivePartial<P>,
            reaction: GeneReaction<P, O>,
            organelles: Stringify<O>,
            override?: string | undefined
        ) => void
    ) => void
) => Chromosome;

export type DefineCreateGene = <P extends Particle, O extends Organelles>(
    name: string,
    triggers: sys.type.RecursivePartial<P>,
    reaction: GeneReaction<P, O>,
    override?: string
) => (organelles: Stringify<O>) => Gene;
