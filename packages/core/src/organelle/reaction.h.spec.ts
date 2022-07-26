import { Meta, Particle } from "../particle";
import {
    AllOrganelleParticles,
    ComingParticle,
    CreateParticle,
    CreateParticleWithoutClass,
    GoingParticle
} from "./particle";
import { AssertTrue, Equals, AssertHasProp } from "./utils";
import { OrganelleReaction } from "./reaction.h";

type Aoc = Particle<"Aoc", boolean>;
type Boc = Particle<"Boc">;
type Coc = Particle<"Coc", boolean, { version: string }>;
type Doc = Particle<"Doc">;
type CocResponse = Particle<"CocResponse", boolean>;
type AocResponse = Particle<"AocResponse", boolean>;

type COP = AllOrganelleParticles<{
    in: [[Aoc, AocResponse], [Boc]];
    out: [[Coc, CocResponse], [Doc]];
}>;

export type Result = [
    AssertTrue<Equals<CreateParticle<ComingParticle<COP, "Aoc">>, (class_: "Aoc", data: boolean) => Aoc>>,
    AssertTrue<Equals<CreateParticle<ComingParticle<COP, "Boc">>, (class_: "Boc") => Boc>>,
    AssertTrue<
        Equals<
            CreateParticle<GoingParticle<COP, "Coc">>,
            (
                class_: "Coc",
                data: boolean,
                adds: Omit<
                    Meta<
                        "Coc",
                        {
                            version: string;
                        }
                    >,
                    "class"
                >
            ) => Coc
        >
    >,
    AssertTrue<Equals<CreateParticle<GoingParticle<COP, "Doc">>, (class_: "Doc") => Doc>>,
    AssertTrue<Equals<CreateParticleWithoutClass<ComingParticle<COP, "Aoc">>, (data: boolean) => Aoc>>,
    AssertTrue<Equals<CreateParticleWithoutClass<ComingParticle<COP, "Boc">>, () => Boc>>,
    AssertTrue<
        Equals<
            CreateParticleWithoutClass<GoingParticle<COP, "Coc">>,
            (
                data: boolean,
                adds: Omit<
                    Meta<
                        "Coc",
                        {
                            version: string;
                        }
                    >,
                    "class"
                >
            ) => Coc
        >
    >,
    AssertTrue<Equals<CreateParticleWithoutClass<GoingParticle<COP, "Doc">>, () => Doc>>
];

/**
 * test OrganelleReaction
 */

type Reaction = OrganelleReaction<COP, "Aoc">;
(): Reaction =>
    async (p, { cp }) => {
        (): [
            AssertTrue<Equals<typeof p, Aoc>>,
            AssertHasProp<typeof cp, "AocResponse">,
            AssertTrue<Equals<ReturnType<typeof cp["AocResponse"]>, AocResponse>>,
            AssertTrue<Equals<typeof cp["AocResponse"], (data: boolean) => AocResponse>>,
            AssertHasProp<typeof cp, "Coc">,
            AssertTrue<Equals<ReturnType<typeof cp["Coc"]>, Coc>>,
            AssertTrue<
                Equals<
                    typeof cp["Coc"],
                    (
                        data: boolean,
                        adds: Omit<
                            Meta<
                                "Coc",
                                {
                                    version: string;
                                }
                            >,
                            "class"
                        >
                    ) => Coc
                >
            >,
            AssertHasProp<typeof cp, "Doc">,
            AssertTrue<Equals<ReturnType<typeof cp["Doc"]>, Doc>>,
            AssertTrue<Equals<typeof cp["Doc"], () => Doc>>
        ] => [] as any;
        return {} as any;
    };
