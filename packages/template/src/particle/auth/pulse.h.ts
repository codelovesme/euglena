import { particle } from "@euglena/core";
import { EuglenaInfo } from "./euglena-info.h";

export type Pulse<P extends particle.Particle = particle.Particle> = particle.Particle<
    "Pulse",
    {
        particle: P;
        sender?: EuglenaInfo;
    }
>;
