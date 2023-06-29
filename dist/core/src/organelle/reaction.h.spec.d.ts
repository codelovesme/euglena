import { ts } from "cessnalib";
import { Meta, Particle } from "../particle";
import { createOrganelleInteractions } from "./organelle-interactions.h";
import { CreateParticle, CreateParticleWithoutClass } from "../particle/create-particle.h";
import { ComingParticle, GoingParticle } from "./in-out-particle.h";
import AssertTrue = ts.test.AssertTrue;
import Equals = ts.test.Equals;
type Aoc = Particle<"Aoc", boolean>;
type Boc = Particle<"Boc">;
type Coc = Particle<"Coc", boolean, {
    version: string;
}>;
type Doc = Particle<"Doc">;
type CocResponse = Particle<"CocResponse", boolean>;
type AocResponse = Particle<"AocResponse", boolean>;
type AocResponse2 = Particle<"AocResponse2", string>;
type COP = createOrganelleInteractions<{
    in: [[Aoc, AocResponse | AocResponse2], [Boc]];
    out: [[Coc, CocResponse], [Doc]];
}>;
export type Result = [
    AssertTrue<Equals<CreateParticle<ComingParticle<COP, "Aoc">>, (class_: "Aoc", data: boolean) => Aoc>>,
    AssertTrue<Equals<CreateParticle<ComingParticle<COP, "Boc">>, (class_: "Boc") => Boc>>,
    AssertTrue<Equals<CreateParticle<GoingParticle<COP, "Coc">>, (class_: "Coc", data: boolean, adds: Omit<Meta<"Coc", {
        version: string;
    }>, "class">) => Coc>>,
    AssertTrue<Equals<CreateParticle<GoingParticle<COP, "Doc">>, (class_: "Doc") => Doc>>,
    AssertTrue<Equals<CreateParticleWithoutClass<ComingParticle<COP, "Aoc">>, (data: boolean) => Aoc>>,
    AssertTrue<Equals<CreateParticleWithoutClass<ComingParticle<COP, "Boc">>, () => Boc>>,
    AssertTrue<Equals<CreateParticleWithoutClass<GoingParticle<COP, "Coc">>, (data: boolean, adds: Omit<Meta<"Coc", {
        version: string;
    }>, "class">) => Coc>>,
    AssertTrue<Equals<CreateParticleWithoutClass<GoingParticle<COP, "Doc">>, () => Doc>>
];
export {};
//# sourceMappingURL=reaction.h.spec.d.ts.map