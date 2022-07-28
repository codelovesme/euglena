// import { Particle } from "../../particle";
import { AllInteractions, Interaction } from "../particle";

// export type SapInteraction = Interaction<Particle<"Sap", any, { organelleName: string }>>;


export type InsertSapIntoParticles<COP extends AllInteractions, I extends Interaction> = {
    in: [I, ...COP["in"]];
    out: COP["out"];
};

