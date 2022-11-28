import { ts } from "cessnalib";
import { Meta, Particle } from "../particle";
import { extendOrganelleInteractions } from "./organelle-interactions.h";
import { CreateParticle, CreateParticleWithoutClass } from "../particle/create-particle.h";
import { ComingParticle, GoingParticle } from "./in-out-particle.h";
import { OrganelleReaction } from "./reaction.h";

import AssertTrue = ts.test.AssertTrue;
import Equals = ts.test.Equals;
import AssertSuper = ts.test.AssertSuper;
import AssertNever = ts.test.AssertNever;

type Aoc = Particle<"Aoc", boolean>;
type Boc = Particle<"Boc">;
type Coc = Particle<"Coc", boolean, { version: string }>;
type Doc = Particle<"Doc">;
type CocResponse = Particle<"CocResponse", boolean>;
type AocResponse = Particle<"AocResponse", boolean>;
type AocResponse2 = Particle<"AocResponse2", string>;

type COP = extendOrganelleInteractions<{
    in: [[Aoc, AocResponse | AocResponse2], [Boc]];
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
            AssertSuper<(class_: "AocResponse", data: boolean) => AocResponse, typeof cp>,
            AssertSuper<(class_: "AocResponse2", data: string) => AocResponse2, typeof cp>,
            AssertSuper<(class_: "Coc", data: boolean, adds: any) => Coc, typeof cp>,
            AssertSuper<(class_: "Doc") => Doc, typeof cp>
        ] => [] as any;
        async (): Promise<CocResponse> => await t({} as Coc);
        const tt = await t({} as Doc);
        (): AssertNever<typeof tt> => tt;
        switch({} as number){
            case 2: return {} as AocResponse2;
            //check if it fails when uncomment
            // case 3: return {} as number;
            default: return {} as AocResponse;
        }
    };
