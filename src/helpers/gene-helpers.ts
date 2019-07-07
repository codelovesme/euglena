import { Transmit, CytoplasmReceive } from "../cytoplasm";
import { sys } from "cessnalib";
import { createMetaV2, createMetaV3 } from ".";
import { Gene, CreateGeneCluster, GeneCluster, GeneV1, GeneV2, GeneV3, GeneReaction } from "../gene";
import { Particle, Tags } from "..";

export function createGeneV1(name: string, triggers: object, reaction: GeneReaction, override?: string, expiretime?: sys.type.Time): GeneV1 {
  return {
    meta: {
      name: "Gene",
      expiretime
    },
    data: {
      name,
      triggers,
      reaction,
      override
    }
  };
}
export function createGeneV2(name: string, triggers: Partial<Particle>, reaction: GeneReaction, of: string, override?: string, expireTime?: number): GeneV2 {
  return {
    meta: createMetaV2("Gene", of, expireTime),
    data: {
      name,
      triggers,
      reaction,
      override
    }
  };
}

export interface GeneOptionals {
  override?: string;
  expireTime?: number;
  tags?: Tags;
}

export function createGeneV3(name: string, triggers: Partial<Particle>, reaction: GeneReaction, { expireTime, tags, override }: GeneOptionals = {}): GeneV3 {
  return {
    meta: createMetaV3("Gene", { expireTime, tags }),
    data: { name, triggers, reaction, override }
  };
}

/**
 * Aliases
 */
export const g1 = createGeneV1;
export const g2 = createGeneV2;
export const g3 = createGeneV3;
