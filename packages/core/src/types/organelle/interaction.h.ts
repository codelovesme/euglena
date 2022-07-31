import { Particle } from "../particle.h";

export type Interaction<P extends Particle = Particle, P2 extends Particle = Particle> =
    | P
    | [P]
    | [P, P2];

import "./interaction.h.spec";
