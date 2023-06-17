import { Particle } from "@euglena/core";
import { EuglenaInfo } from "./euglena-info.par.h";

export type Pulse<P extends Particle = Particle> = Particle<
    "Pulse",
    {
        particle: P;
        sender?: EuglenaInfo;
    }
>;
