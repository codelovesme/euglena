import { AllInteractions, Particle } from "@euglena/core";
import { ACK, Exception, Log } from "../particle";

export type Namespace = "Fs";

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
    },
    { namespace: Namespace }
>;
export type ReadFile = Particle<
    "ReadFile",
    {
        filePath: string;
        encoding?: Encoding;
    },
    { namespace: Namespace }
>;
export type FileContent = Particle<"FileContent", string, { namespace: Namespace }>;

export type FS = AllInteractions<{
    in: [[ReadFile, FileContent | Exception], [WriteFile, Exception | ACK]];
    out: [Log, ACK];
}>;
