import { Particle } from "../../particle";
import { AllOrganelleParticles, Interaction } from "../particle";

export type SapInteraction = Interaction<Particle<"Sap", any, { organelleName: string }>>;


export type InsertSapIntoParticles<COP extends AllOrganelleParticles, I extends SapInteraction> = {
    in: [I, ...COP["in"]];
    out: COP["out"];
};

