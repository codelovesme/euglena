import { Particle } from "../particle.h";
import { Interaction } from "./interaction.h";


type AssertInteraction<T extends Interaction> = T;

export type Result = [
    AssertInteraction<[Particle]>,
    AssertInteraction<[Particle, Particle]>,
    AssertInteraction<[Particle] | [Particle]>,
    AssertInteraction<[Particle] | [Particle, Particle]>,
    AssertInteraction<[Particle, Particle] | [Particle]>,
    AssertInteraction<[Particle, Particle] | [Particle, Particle]>,
    AssertInteraction<[Particle<"abc">]>,
    AssertInteraction<[Particle, Particle<"vbvb">]>,
    AssertInteraction<[Particle, Particle<"vbc">]>,
    AssertInteraction<[Particle] | [Particle<"gfgfgfgfg">]>,
];
