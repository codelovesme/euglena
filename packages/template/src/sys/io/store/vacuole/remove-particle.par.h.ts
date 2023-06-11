import { Particle } from "@euglena/core";

import { type } from "cessnalib";
import { Count } from "./count.h";

export type RemoveParticle<P extends Particle = Particle> = Particle<"RemoveParticle", { query: type.RecursivePartial<P>; count: Count }>;
