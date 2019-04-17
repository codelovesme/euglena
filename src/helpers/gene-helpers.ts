import { Transmit, CytoplasmReceive, Reaction } from "../cytoplasm";
import { sys } from "cessnalib";
import { createMetaV2, createMetaV3 } from ".";
import { Gene, CreateGeneCluster, GeneCluster, GeneV1, GeneV2, GeneOptionals, GeneV3 } from "../gene";
import { Particle } from "..";

export interface AddGene {
  (gene: Gene): void;
}

export interface FillGeneCluster {
  (addGene: AddGene, transmit: Transmit, receive: CytoplasmReceive): void;
}

export function defineCreateGeneCluster(fillGeneCluster: FillGeneCluster): CreateGeneCluster {
  return (transmit: Transmit, receive: CytoplasmReceive) => {
    const geneCluster: GeneCluster = [];
    fillGeneCluster(
      (gene: Gene) => {
        geneCluster.push(gene);
      },
      transmit,
      receive
    );
    return geneCluster;
  };
}

export function createGeneV1(name: string, triggers: object, reaction: Reaction, override?: string, expiretime?: sys.type.Time): GeneV1 {
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
export function createGeneV2(name: string, triggers: Partial<Particle>, reaction: Reaction, of: string, override?: string, expireTime?: number): GeneV2 {
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

export function createGeneV3(name: string, triggers: Partial<Particle>, reaction: Reaction, { createdBy, expireAt, tags, override }: GeneOptionals = {}): GeneV3 {
  return {
    meta: createMetaV3("Gene", createdBy, { expireAt, tags }),
    data: {
      name,
      triggers,
      reaction,
      override
    }
  };
}

/**
 * Aliases
 */
export const g1 = createGeneV1;
export const g2 = createGeneV2;
export const g3 = createGeneV3;
export const defG = defineCreateGeneCluster;
