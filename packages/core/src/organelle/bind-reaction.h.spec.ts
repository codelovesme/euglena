import { ts } from "cessnalib";
import { Meta, Particle } from "../particle";
import { createOrganelleInteractions, OrganelleInteractions } from "./organelle-interactions.h";
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

type COP = createOrganelleInteractions<{
    in: [[Aoc, AocResponse], [Boc]];
    out: [[Coc, CocResponse], [Doc]];
}>;

type Bind = BindOrganelleReactions<COP>;

type CP = ((class_: "AocResponse", data: boolean) => AocResponse) &
    ((
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
    ) => Coc) &
    ((class_: "Doc") => Doc);

type T = ((particle: Coc) => Promise<CocResponse>) & ((particle: Doc) => Promise<never>);

export type Result = [
    AssertSuper<keyof Bind, "Aoc" | "Boc">,
    AssertSuper<"Aoc" | "Boc", keyof Bind>,

    AssertTrue<Equals<ReturnType<Bind["Aoc"]>, Promise<AocResponse>>>,
    AssertSuper<Bind["Aoc"], (particle: Aoc, { t, cp }: { t: T; cp: CP }) => Promise<AocResponse>>
];

const abc = (t: Bind["Aoc"]) => t;

abc(async (p, { t, cp }) => {
    true as unknown as [
        AssertTrue<Equals<typeof p, Aoc>>,
        AssertTrue<Equals<typeof t, T>>,
        AssertTrue<Equals<typeof cp, CP>>
    ];
    return {} as AocResponse;
});

abc(async (p, { t }) => {
    true as unknown as [AssertTrue<Equals<typeof p, Aoc>>, AssertTrue<Equals<typeof t, T>>];
    return {} as AocResponse;
});
