import { type } from "cessnalib";
import {Particle} from "@euglena/core";
import { Count } from "./count.h";

export type SaveParticle<P extends Particle = Particle> = Particle<
    "SaveParticle",
    | {
        particle: P;
        query?: type.RecursivePartial<P>;
        count: Count;
    }
    | P[]
>;