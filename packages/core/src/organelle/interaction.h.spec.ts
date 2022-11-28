import { ts } from "cessnalib";
import { Particle } from "../particle";
import { Interaction, InteractionInName } from "./interaction.h";

import AssertSuper = ts.test.AssertSuper;

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

    AssertSuper<InteractionInName<[Particle<"abc">]>, "abc">,
    AssertSuper<InteractionInName<[Particle<"abc">]>, ["abc"]>,
    AssertSuper<InteractionInName<[Particle<"abc">, Particle<"def">]>, ["abc", "def"]>
];
