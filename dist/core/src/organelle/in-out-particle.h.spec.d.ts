import { ts } from "cessnalib";
import { Particle } from "../particle";
import { createOrganelleInteractions } from "./organelle-interactions.h";
import { TriggerParticleFromInteraction, ResponseParticleFromInteraction, ComingParticleNameUnion, ComingParticleResponseNameUnion, GoingParticleNameUnion, GoingParticleResponseNameUnion, ComingParticleUnion, ComingParticle, GoingParticleUnion, GoingParticle, AllParticleNameUnion, AllParticleUnion } from "./in-out-particle.h";
import AssertTrue = ts.test.AssertTrue;
import Equals = ts.test.Equals;
import AssertSuper = ts.test.AssertSuper;
type Aoc = Particle<"Aoc">;
type Boc = Particle<"Boc", boolean, {
    version: string;
}>;
type Coc = Particle<"Coc">;
type Doc = Particle<"Doc", boolean>;
type CocResponse = Particle<"CocResponse", boolean>;
type AocResponse = Particle<"AocResponse", boolean>;
type COP = createOrganelleInteractions<{
    in: [[Aoc, AocResponse], [Boc]];
    out: [[Coc, CocResponse], [Doc]];
}>;
export type Result = [
    AssertSuper<TriggerParticleFromInteraction<COP["in"][number]>, Aoc | Boc>,
    AssertSuper<Aoc | Boc, TriggerParticleFromInteraction<COP["in"][number]>>,
    AssertSuper<ResponseParticleFromInteraction<COP["in"][number]>, AocResponse>,
    AssertSuper<AocResponse, ResponseParticleFromInteraction<COP["in"][number]>>,
    AssertSuper<TriggerParticleFromInteraction<COP["out"][number]>, Coc | Doc>,
    AssertSuper<Coc | Doc, TriggerParticleFromInteraction<COP["out"][number]>>,
    AssertSuper<ResponseParticleFromInteraction<COP["out"][number]>, CocResponse>,
    AssertSuper<CocResponse, ResponseParticleFromInteraction<COP["out"][number]>>,
    AssertSuper<ComingParticleNameUnion<COP>, "Aoc" | "Boc">,
    AssertSuper<"Aoc" | "Boc", ComingParticleNameUnion<COP>>,
    AssertSuper<ComingParticleResponseNameUnion<COP>, "AocResponse">,
    AssertSuper<"AocResponse", ComingParticleResponseNameUnion<COP>>,
    AssertSuper<GoingParticleNameUnion<COP>, "Coc" | "Doc">,
    AssertSuper<"Coc" | "Doc", GoingParticleNameUnion<COP>>,
    AssertSuper<GoingParticleResponseNameUnion<COP>, "CocResponse">,
    AssertSuper<"CocResponse", GoingParticleResponseNameUnion<COP>>,
    AssertSuper<ComingParticleUnion<COP>, Aoc | Boc>,
    AssertSuper<Aoc | Boc, ComingParticleUnion<COP>>,
    AssertSuper<ComingParticle<COP, "Aoc">, Aoc>,
    AssertTrue<Equals<ComingParticle<COP, "Aoc">, Aoc>>,
    AssertSuper<ComingParticle<COP, "Boc">, Boc>,
    AssertTrue<Equals<ComingParticle<COP, "Boc">, Boc>>,
    AssertSuper<GoingParticleUnion<COP>, Coc | Doc>,
    AssertSuper<Coc | Doc, GoingParticleUnion<COP>>,
    AssertSuper<GoingParticle<COP, "Coc">, Coc>,
    AssertTrue<Equals<GoingParticle<COP, "Coc">, Coc>>,
    AssertSuper<GoingParticle<COP, "Coc">, Coc>,
    AssertTrue<Equals<GoingParticle<COP, "Coc">, Coc>>,
    AssertSuper<GoingParticle<COP, "Doc">, Doc>,
    AssertTrue<Equals<GoingParticle<COP, "Doc">, Doc>>,
    AssertTrue<[Particle, Particle] extends Particle[] ? true : false>,
    AssertTrue<[Particle] extends Particle[] ? true : false>,
    AssertSuper<AllParticleNameUnion<COP>, "Aoc" | "Boc" | "Coc" | "Doc" | "CocResponse" | "AocResponse">,
    AssertSuper<"Aoc" | "Boc" | "Coc" | "Doc" | "CocResponse" | "AocResponse", AllParticleNameUnion<COP>>,
    AssertSuper<AllParticleUnion<COP>, Aoc | Boc | Coc | Doc | CocResponse | AocResponse>,
    AssertSuper<Aoc | Boc | Coc | Doc | CocResponse | AocResponse, AllParticleUnion<COP>>
];
export {};
//# sourceMappingURL=in-out-particle.h.spec.d.ts.map