import { Particle } from "@euglena/core";
import { Encoding } from "./encoding.h";

export type WriteFile = Particle<
    "WriteFile",
    {
        filePath: string;
        content: string;
        encoding?: Encoding;
    }
>;