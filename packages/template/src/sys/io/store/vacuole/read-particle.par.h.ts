import { Particle } from "@euglena/core";
import { type } from "cessnalib";
import { Count } from "./count.h";

export type ReadParticle<P extends Particle = Particle> = Particle<
    "ReadParticle",
    {
        query: type.RecursivePartial<P>;
        count: Count;
    }
>;