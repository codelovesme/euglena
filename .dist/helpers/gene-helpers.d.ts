import { Transmit, CytoplasmReceive, Reaction } from "../cytoplasm";
import { sys } from "cessnalib";
import { Gene, CreateGeneCluster, GeneV1, GeneV2, GeneOptionals, GeneV3 } from "../gene";
import { Particle } from "..";
export interface AddGene {
    (gene: Gene): void;
}
export interface FillGeneCluster {
    (addGene: AddGene, transmit: Transmit, receive: CytoplasmReceive): void;
}
export declare function defineCreateGeneCluster(fillGeneCluster: FillGeneCluster): CreateGeneCluster;
export declare function createGeneV1(name: string, triggers: object, reaction: Reaction, override?: string, expiretime?: sys.type.Time): GeneV1;
export declare function createGeneV2(name: string, triggers: Partial<Particle>, reaction: Reaction, of: string, override?: string, expireTime?: number): GeneV2;
export declare function createGeneV3(name: string, triggers: Partial<Particle>, reaction: Reaction, { createdBy, expireAt, tags, override }?: GeneOptionals): GeneV3;
/**
 * Aliases
 */
export declare const g1: typeof createGeneV1;
export declare const g2: typeof createGeneV2;
export declare const g3: typeof createGeneV3;
export declare const defG: typeof defineCreateGeneCluster;
