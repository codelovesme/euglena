import { ParticleV1, ParticleV2, Particle, ParticleV3, Tags } from "./particle";
import { sys } from "cessnalib";
import { CytoplasmReceive, Reaction, Transmit } from "./cytoplasm";
export interface GeneV1Data {
    name: string;
    triggers: object;
    reaction: Reaction;
    override?: string;
}
export interface GeneV1 extends ParticleV1 {
    meta: {
        expiretime?: sys.type.Time;
        name: string;
    };
    data: GeneV1Data;
}
export interface GeneV2Data {
    name: string;
    triggers: Partial<Particle>;
    reaction: Reaction;
    override?: string;
}
export interface GeneV2 extends ParticleV2<GeneV2Data> {
    data: GeneV2Data;
}
export interface GeneV3Data {
    name: string;
    triggers: Partial<Particle>;
    reaction: Reaction;
    override?: string;
}
export interface GeneV3 extends ParticleV3<"Gene", GeneV3Data> {
    data: GeneV3Data;
}
export interface GeneOptionals {
    override?: string;
    createdBy?: string;
    expireAt?: number;
    tags?: Tags;
}
export declare type Gene = GeneV1 | GeneV2 | GeneV3;
export interface GeneCluster extends Array<Gene> {
}
export interface CreateGeneCluster {
    (transmit: Transmit, receive: CytoplasmReceive): GeneCluster;
}
export interface Chromosome extends Array<Gene> {
}
