import { Particle } from "../../particle";

export type Interaction<P extends Particle = Particle<string, any>, P2 extends Particle = Particle<string, any>> =
    | P
    | [P]
    | [P, P2];
