import { particle, organelle } from "@euglena/core";
import { common } from "../particle";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import CreateParticleUnion = particle.CreateParticleUnion;

export type Encoding =
    | "ascii"
    | "utf8"
    | "utf-8"
    | "utf16le"
    | "ucs2"
    | "ucs-2"
    | "base64"
    | "latin1"
    | "binary"
    | "hex";

export type WriteFile = particle.Particle<
    "WriteFile",
    {
        filePath: string;
        content: string;
        encoding?: Encoding;
    }
>;
export type ReadFile = particle.Particle<
    "ReadFile",
    {
        filePath: string;
        encoding?: Encoding;
    }
>;
export type FileContent = particle.Particle<"FileContent", string>;

export type FS = extendOrganelleInteractions<{
    in: [[ReadFile, FileContent | common.Exception], [WriteFile, common.Exception | common.ACK]];
    out: [common.Log, common.ACK];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<FS>>;
export const cp = createParticle;
