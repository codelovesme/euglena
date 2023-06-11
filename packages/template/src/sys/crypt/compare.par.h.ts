import { Particle } from "@euglena/core";
import { Plain } from "./plain.par.h";
import { Hash } from "./hash.par.h";

export type Compare = Particle<
    "Compare",
    {
        plain: Plain;
        hash: Hash;
    }
>;