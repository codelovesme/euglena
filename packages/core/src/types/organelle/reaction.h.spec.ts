// import { Exception } from "../../utils";
import { sys } from "cessnalib";
import { Exception } from "../../utils";
import { Meta, Particle } from "../particle.h";
import { AllInteractions } from "./all-interactions.h";
import { CreateParticle, CreateParticleWithoutClass } from "./create-particle.h";
import { ComingParticle, GoingParticle } from "./in-out-particle.h";
import { OrganelleReaction } from "./reaction.h";

// import { OrganelleReaction } from "./reaction.h";
import { AssertSuper, AssertTrue, Equals } from "./utils";

type Aoc = Particle<"Aoc", boolean>;
type Boc = Particle<"Boc">;
type Coc = Particle<"Coc", boolean, { version: string }>;
type Doc = Particle<"Doc">;
type CocResponse = Particle<"CocResponse", boolean>;
type AocResponse = Particle<"AocResponse", boolean>;

type COP = AllInteractions<{
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
    async (p, { cp, t }) => {
        (): [
            AssertTrue<Equals<typeof p, Aoc>>,
            AssertSuper<(class_: "Exception", data: sys.type.Exception) => Exception, typeof cp>,
            AssertSuper<(class_: "AocResponse", data: boolean) => AocResponse, typeof cp>,
            AssertSuper<(class_: "Coc", data: boolean, adds: any) => Coc, typeof cp>,
            AssertSuper<(class_: "Doc") => Doc, typeof cp>
        ] => [] as any;
        t({} as Coc);
        t({} as Doc);
        switch ({} as number) {
            case 1:
                return {} as AocResponse;
            //Uncommet to check if it gets an error
            // case 2: return {} as boolean;
            default:
                return {} as Exception;
        }
    };
