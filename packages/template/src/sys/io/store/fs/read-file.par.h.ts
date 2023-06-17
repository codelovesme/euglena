import { Particle } from "@euglena/core";
import { Encoding } from "./encoding.h";

export type ReadFile = Particle<
    "ReadFile",
    {
        filePath: string;
        encoding?: Encoding;
    }
>;