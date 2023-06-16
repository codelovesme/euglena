import { Particle } from "@euglena/core";
import { sys } from "cessnalib";
import { Count } from "./count.h";

export type ReadParticle<P extends Particle = Particle> = Particle<
    "ReadParticle",
    {
        query: sys.RecursivePartial<P>;
        count: Count;
    }
>;