import { CytoplasmReceive, Transmit } from "./cytoplasm.h";
import { Particle } from "./particle.h";
import { CreateOrganelleParticles, InComingParticleUnion, OutGoingParticleUnion, ParticleUnion, OutGoingParticleNameUnion, InComingParticleNameUnion } from "./organelle.h";
import { CreateCommonParticles } from "../template/common-particles.h";
import { sys } from "cessnalib";
import { logger } from "../template/organelles/logger";
import { vacuole } from "../template/organelles/vacuole";
import { timer } from "../template/organelles/timer";
export declare type AlreadyAddedOrganelleParticleUnion = InComingParticleUnion<typeof logger.cp> | InComingParticleUnion<typeof timer.cp> | InComingParticleUnion<typeof vacuole.cp>;
export declare type AlreadyAddedOrganelleMaps = {
    Logger: typeof logger.cp;
    Timer: typeof timer.cp;
    Vacuole: typeof vacuole.cp;
};
export declare type CreateOrganelleParticlesMap = {
    [x: string]: CreateOrganelleParticles;
};
export declare type InComingParticleOfCOPM<M extends CreateOrganelleParticlesMap> = InComingParticleUnion<M[keyof M]>;
export declare type OutGoingParticleOfCOPM<M extends CreateOrganelleParticlesMap> = OutGoingParticleUnion<M[keyof M]>;
export declare type InComingParticleNameOfCOPM<M extends CreateOrganelleParticlesMap> = InComingParticleNameUnion<M[keyof M]>;
export declare type OutGoingParticleNameOfCOPM<M extends CreateOrganelleParticlesMap> = OutGoingParticleNameUnion<M[keyof M]>;
export interface GeneReaction<TriggerParticle extends Particle = Particle, M extends CreateOrganelleParticlesMap = CreateOrganelleParticlesMap> {
    (particle: TriggerParticle, sender: string, tools: {
        receive: CytoplasmReceive;
        /**
         * Alias for receive
         */
        r: CytoplasmReceive;
        transmit: Transmit;
        /**
         * Alias for transmit
         */
        t: Transmit;
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
    <M extends CreateOrganelleParticlesMap>(organelles: M, bind: (addGene: AddGene<AlreadyAddedOrganelleParticleUnion | ParticleUnion<CreateCommonParticles>, M & AlreadyAddedOrganelleMaps>) => void): Chromosome;
}
export interface GeneOptionals {
    override?: string;
    expireTime?: number;
}
export interface AddGene<OutGoingParticle extends Particle, M extends CreateOrganelleParticlesMap> {
    <TriggerParticle extends OutGoingParticle>(name: string, triggers: sys.type.RecursivePartial<TriggerParticle>, reaction: GeneReaction<TriggerParticle, M>, geneOptionals?: GeneOptionals): void;
}
