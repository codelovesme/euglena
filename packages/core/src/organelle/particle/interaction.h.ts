import { Particle } from "../../particle";

export type Interaction<
    P extends Particle = Particle,
    P2 extends Particle = Particle,
    P3 extends Particle = Particle
> = [P] | [P, P2] | [P, P2, P3];