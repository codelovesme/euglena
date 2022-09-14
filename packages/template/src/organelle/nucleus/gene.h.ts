import { sys } from "cessnalib";
import { OrganelleTransmit, Particle } from "@euglena/core";
import * as coreModule from "@euglena/core";
import * as templateModule from "../../index";
import * as cessnalib from "cessnalib";

export type TemplateModule = typeof templateModule;
export type CoreModule = typeof coreModule;
export type Cessnalib = typeof cessnalib;

type _Organelles = {
    [organelleName: string]: string;
};
export type Organelles<T extends _Organelles = _Organelles> = T & {
    nucleus: "Nucleus";
};

type _Parameters = {
    [key: string]: string | number | boolean;
};
export type Parameters<T extends _Parameters = _Parameters> = T;

export type Dependencies<O extends Organelles = Organelles, P extends Parameters = Parameters> = {
    organelles: O;
    parameters: P;
};

export interface GeneReaction<TriggerParticle extends Particle = Particle, D extends Dependencies = Dependencies> {
    (
        particle: TriggerParticle,
        source: string,
        tools: {
            /**
             * OrganelleTransmit
             */
            t: OrganelleTransmit;
            /**
             *Send particle to specific organelle
             */
            to: {
                [P in keyof D["organelles"]]: <
                    P extends Particle = Particle,
                    Resp extends Particle | void = Particle | void
                >(
                    particle: P
                ) => ReturnType<OrganelleTransmit<P, Resp>>;
            };
            /**
             * Specify the referenced organelle names
             */
            o: D["organelles"];
            /**
             * Parameters
             */
            params: D["parameters"];
        }
    ): Promise<Particle | void>;
}

export type Gene<TriggerParticle extends Particle = Particle, D extends Dependencies = Dependencies> = Particle<
    "Gene",
    {
        name: string;
        triggers: sys.type.RecursivePartial<TriggerParticle>;
        reaction: GeneReaction<TriggerParticle, D>;
        dependencies: D;
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
