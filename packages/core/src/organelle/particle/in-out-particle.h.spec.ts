import { Particle } from "../../particle";
import { AssertSuper, AssertTrue, Equals } from "../utils";
import { AllOrganelleParticles } from "./all-organelle-particle.h";
import {
    ComingParticle,
    ComingParticleNameUnion,
    ComingParticles,
    ComingResponseParticleNameUnion,
    GoingParticle,
    GoingParticleNameUnion,
    GoingParticles,
    GoingResponseParticleNameUnion
} from "./in-out-particle.h";

type Aoc = Particle<"Aoc">;
type Boc = Particle<"Boc", boolean, { version: string }>;
type Coc = Particle<"Coc">;
type Doc = Particle<"Doc", boolean>;
type CocResponse = Particle<"CocResponse", boolean>;
type AocResponse = Particle<"AocResponse", boolean>;

type COP = AllOrganelleParticles<{
    in: [[Aoc, AocResponse], [Boc]];
    out: [[Coc, CocResponse], [Doc]];
}>;

export type Result = [
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
    AssertTrue<Equals<GoingParticle<COP, "Doc">, Doc>>
];
