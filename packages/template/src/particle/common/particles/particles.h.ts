import { particle } from "@euglena/core";

import Particle = particle.Particle;

export type Particles<T extends Particle = Particle> = particle.Particle<"Particles", T[]>;
