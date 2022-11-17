import { AllInteractions, Particle, cp as _cp, ComingParticles, CreateParticleUnion } from "@euglena/core";
import { common } from "../particle";

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

export type WriteFile = Particle<
    "WriteFile",
    {
        filePath: string;
        content: string;
        encoding?: Encoding;
    }
>;
export type ReadFile = Particle<
    "ReadFile",
    {
        filePath: string;
        encoding?: Encoding;
    }
>;
export type FileContent = Particle<"FileContent", string>;

export type FS = AllInteractions<{
    in: [[ReadFile, FileContent | common.Exception], [WriteFile, common.Exception | common.ACK]];
    out: [common.Log, common.ACK];
}>;

export const createParticle = _cp as CreateParticleUnion<ComingParticles<FS>>;
export const cp = createParticle;
