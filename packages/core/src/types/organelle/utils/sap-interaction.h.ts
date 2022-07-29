import { AllInteractions } from "../all-interactions.h";
import { Interaction } from "../interaction";

export type InsertSapIntoParticles<COP extends AllInteractions, I extends Interaction> = {
    in: [I, ...COP["in"]];
    out: COP["out"];
};

