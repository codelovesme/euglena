import { Interaction } from "./interaction.h";
import { Particle } from "../../particle";

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
