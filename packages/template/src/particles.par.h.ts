import { Particle } from "@euglena/core";

export type Particles<T extends Particle = Particle> = Particle<"Particles", T[]>;

import "./particles.par.h.spec";
