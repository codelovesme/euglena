import { Interaction } from "./interaction.h";

export type ParticleStructure = {
    in: Interaction[];
    out: Interaction[];
};

export type AllOrganelleParticles<I extends ParticleStructure = ParticleStructure> = I;