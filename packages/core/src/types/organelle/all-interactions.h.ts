import { Interaction } from "./interaction";

export type ParticleStructure = {
    in: Interaction[];
    out: Interaction[];
};

export type AllInteractions<I extends ParticleStructure = ParticleStructure> = I;