import { ts } from "cessnalib";
import { Particle } from "../particle";
import { CreateOrganelle } from "./create-organelle.h";
import { dco } from "./define-create-organelle";
import { createOrganelleInteractions } from "./organelle-interactions.h";
import { OrganelleTransmit } from "./reaction.h";

import AssertTrue = ts.test.AssertTrue;
import Equals = ts.test.Equals;
import AssertSuper = ts.test.AssertSuper;

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

type SapInteraction = [Particle<"Sap", { a: string; b: number }>];

export const createOrganelle:CreateOrganelle = dco<COP, SapInteraction>({
    Sap: async (p) => {},
    Aoc: async (p, { t, cp }) => {
        true as unknown as [
            AssertTrue<Equals<typeof p, Aoc>>,
            AssertSuper<typeof t, OrganelleTransmit<COP>>,
            AssertTrue<Equals<typeof p, Aoc>>,
            AssertSuper<(class_: "AocResponse", data: boolean) => AocResponse, typeof cp>,
            AssertSuper<(class_: "Coc", data: boolean, adds: any) => Coc, typeof cp>,
            AssertSuper<(class_: "Doc") => Doc, typeof cp>
        ];

        return "a" in t ? ({} as AocResponse) : ({} as never);
    },
    Boc: async () => {}
});