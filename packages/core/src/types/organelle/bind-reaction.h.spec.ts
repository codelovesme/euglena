import { sys } from "cessnalib";
import { Exception } from "../../utils";
import { Particle } from "../particle.h";
import { AllInteractions } from "./all-interactions.h";
import { ComingParticleNameUnion } from "./in-out-particle.h";
import { OrganelleTransmit } from "./organelle-receive.h";
import { OrganelleReaction } from "./reaction.h";
import { AssertSuper, AssertTrue, Equals } from "./utils";

export type BindOrganelleReactions<COP extends AllInteractions> = {
    [CPN in ComingParticleNameUnion<COP>]: OrganelleReaction<COP, CPN>;
};

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

type Bind = BindOrganelleReactions<COP>;

export type Result = [
    AssertSuper<keyof Bind, "Aoc" | "Boc">,
    AssertSuper<"Aoc" | "Boc", keyof Bind>,

    AssertTrue<Equals<ReturnType<Bind["Aoc"]>, Promise<AocResponse | Exception>>>,
    AssertSuper<Bind["Aoc"], (particle: Aoc, { t, cp }) => Promise<AocResponse | Exception>>
];

const abc = (t: Bind["Aoc"]) => t;

abc(async (p, { t, cp }) => {
    true as unknown as [
        AssertTrue<Equals<typeof p, Aoc>>,
        AssertTrue<Equals<typeof t, OrganelleTransmit<Coc | Doc, CocResponse>>>,
        AssertTrue<
            Equals<
                typeof cp,
                {
                    Coc: (
                        data: boolean,
                        adds: {
                            version: string;
                        }
                    ) => Coc;
                    Doc: () => Doc;
                } & {
                    AocResponse: (data: boolean) => AocResponse;
                } & {
                    Exception: (data: sys.type.Exception) => Exception;
                }
            >
        >
    ];
    return {} as AocResponse;
});
