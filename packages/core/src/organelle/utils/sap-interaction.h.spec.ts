import { Particle } from "../../particle";
import { AssertTrue, Equals } from ".";
import { AllOrganelleParticles, Interaction } from "../particle";

export type SapInteraction = Interaction<Particle<"Sap", any, { organelleName: string }>>;

export type InsertSapIntoParticles<COP extends AllOrganelleParticles, I extends SapInteraction> = {
    in: [I, ...COP["in"]];
    out: COP["out"];
};

type Aoc = Particle<"Aoc">;
type Boc = Particle<"Boc">;
type Coc = Particle<"Coc">;
type Doc = Particle<"Doc">;
type CocResponse = Particle<"CocResponse", boolean>;
type AocResponse = Particle<"AocResponse", boolean>;

type COP = AllOrganelleParticles<{
    in: [[Aoc, AocResponse], [Boc]];
    out: [[Coc, CocResponse], [Doc]];
}>;

type I = SapInteraction;

export type Result = [
    AssertTrue<
        Equals<
            InsertSapIntoParticles<COP, I>,
            {
                in: [I, [Aoc, AocResponse], [Boc]];
                out: [[Coc, CocResponse], [Doc]];
            }
        >
    >
];
