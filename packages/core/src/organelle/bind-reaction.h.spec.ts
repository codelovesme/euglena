import { ts } from "cessnalib";
import { Particle } from "../particle";
import { extendOrganelleInteractions, OrganelleInteractions } from "./organelle-interactions.h";
import { ComingParticleNameUnion } from "./in-out-particle.h";
import { OrganelleReaction } from "./reaction.h";

import AssertTrue = ts.test.AssertTrue;
import Equals = ts.test.Equals;
import AssertSuper = ts.test.AssertSuper;

export type BindOrganelleReactions<COP extends OrganelleInteractions> = {
    [CPN in ComingParticleNameUnion<COP>]: OrganelleReaction<COP, CPN>;
};

type Aoc = Particle<"Aoc", boolean>;
type Boc = Particle<"Boc">;
type Coc = Particle<"Coc", boolean, { version: string }>;
type Doc = Particle<"Doc">;
type CocResponse = Particle<"CocResponse", boolean>;
type AocResponse = Particle<"AocResponse", boolean>;

type COP = extendOrganelleInteractions<{
    in: [[Aoc, AocResponse], [Boc]];
    out: [[Coc, CocResponse], [Doc]];
}>;

type Bind = BindOrganelleReactions<COP>;

// type CP = {
//     Coc: (
//         data: boolean,
//         adds: {
//             version: string;
//         }
//     ) => Coc;
//     Doc: () => Doc;
// } & {
//     AocResponse: (data: boolean) => AocResponse;
// } & {
//     Exception: (data: sys.type.Exception) => Exception;
// };

type T = ((particle: Coc) => Promise<CocResponse>) & ((particle: Doc) => Promise<never>);

export type Result = [
    AssertSuper<keyof Bind, "Aoc" | "Boc">,
    AssertSuper<"Aoc" | "Boc", keyof Bind>,

    AssertTrue<Equals<ReturnType<Bind["Aoc"]>, Promise<AocResponse>>>,
    // AssertSuper<Bind["Aoc"], (particle: Aoc, { t, cp }: { t: T; cp: CP }) => Promise<AocResponse | Exception>>
    AssertSuper<Bind["Aoc"], (particle: Aoc, { t }: { t: T }) => Promise<AocResponse>>
];

const abc = (t: Bind["Aoc"]) => t;

// abc(async (p, { t, cp }) => {
//     true as unknown as [
//         AssertTrue<Equals<typeof p, Aoc>>,
//         AssertTrue<Equals<typeof t, T>>,
//         AssertTrue<Equals<typeof cp, CP>>
//     ];
//     return {} as AocResponse;
// });

abc(async (p, { t }) => {
    true as unknown as [
        AssertTrue<Equals<typeof p, Aoc>>,
        AssertTrue<Equals<typeof t, T>>,
    ];
    return {} as AocResponse;
});