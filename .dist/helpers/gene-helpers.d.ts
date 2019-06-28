import { sys } from "cessnalib";
import { GeneV1, GeneV2, GeneOptionals, GeneV3, GeneReaction } from "../gene";
import { Particle } from "..";
export declare function createGeneV1(name: string, triggers: object, reaction: GeneReaction, override?: string, expiretime?: sys.type.Time): GeneV1;
export declare function createGeneV2(name: string, triggers: Partial<Particle>, reaction: GeneReaction, of: string, override?: string, expireTime?: number): GeneV2;
export declare function createGeneV3(name: string, triggers: Partial<Particle>, reaction: GeneReaction, { createdBy, expireAt, tags, override }?: GeneOptionals): GeneV3;
/**
 * Aliases
 */
export declare const g1: typeof createGeneV1;
export declare const g2: typeof createGeneV2;
export declare const g3: typeof createGeneV3;
