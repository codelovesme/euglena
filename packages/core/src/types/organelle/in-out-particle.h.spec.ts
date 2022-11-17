import { Particle } from "../particle.h";
import { AllInteractions } from "./all-interactions.h";
import {
    TriggerParticleFromInteraction,
    ResponseParticleFromInteraction,
    ComingParticleNameUnion,
    ComingResponseParticleNameUnion,
    GoingParticleNameUnion,
    GoingResponseParticleNameUnion,
    ComingParticles,
    ComingParticle,
    GoingParticles,
    GoingParticle,
    AllParticleNameUnion,
    AllParticles
} from "./in-out-particle.h";
import { AssertSuper, AssertTrue, Equals } from "./utils";

type Aoc = Particle<"Aoc">;
type Boc = Particle<"Boc", boolean, { version: string }>;
type Coc = Particle<"Coc">;
type Doc = Particle<"Doc", boolean>;
type CocResponse = Particle<"CocResponse", boolean>;
type AocResponse = Particle<"AocResponse", boolean>;

type COP = AllInteractions<{
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

    AssertSuper<ComingResponseParticleNameUnion<COP>, "AocResponse">,
    AssertSuper<"AocResponse", ComingResponseParticleNameUnion<COP>>,

    AssertSuper<GoingParticleNameUnion<COP>, "Coc" | "Doc">,
    AssertSuper<"Coc" | "Doc", GoingParticleNameUnion<COP>>,

    AssertSuper<GoingResponseParticleNameUnion<COP>, "CocResponse">,
    AssertSuper<"CocResponse", GoingResponseParticleNameUnion<COP>>,

    AssertSuper<ComingParticles<COP>, Aoc | Boc>,
    AssertSuper<Aoc | Boc, ComingParticles<COP>>,

    AssertSuper<ComingParticle<COP, "Aoc">, Aoc>,
    AssertTrue<Equals<ComingParticle<COP, "Aoc">, Aoc>>,

    AssertSuper<ComingParticle<COP, "Boc">, Boc>,
    AssertTrue<Equals<ComingParticle<COP, "Boc">, Boc>>,

    AssertSuper<GoingParticles<COP>, Coc | Doc>,
    AssertSuper<Coc | Doc, GoingParticles<COP>>,

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

    AssertSuper<AllParticles<COP>, Aoc | Boc | Coc | Doc | CocResponse | AocResponse>,
    AssertSuper<Aoc | Boc | Coc | Doc | CocResponse | AocResponse, AllParticles<COP>>
];
