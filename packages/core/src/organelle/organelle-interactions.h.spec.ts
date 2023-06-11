import { ts } from "cessnalib";
import { Particle } from "../particle";
import { createOrganelleInteractions, OrganelleInteractions } from "./organelle-interactions.h";

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

[] as unknown as [ts.test.AssertSuper<OrganelleInteractions, COP>];
