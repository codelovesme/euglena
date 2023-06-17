import { Particle } from "@euglena/core";

import { sys } from "cessnalib";
import { Count } from "./count.h";

export type RemoveParticle<P extends Particle = Particle> = Particle<"RemoveParticle", { query: sys.RecursivePartial<P>; count: Count }>;
