import { BindOrganelleReactions } from "./bind-reaction.h";
import { AllInteractions, ComingParticles, ComingResponseParticle, Interaction } from "./particle";
import { InsertSapIntoParticles } from "./utils";
import { CreateOrganelle } from "./create-organelle.h";

export type DefineCreateOrganelle = <COP extends AllInteractions, I extends Interaction>(
    bindReactions: BindOrganelleReactions<InsertSapIntoParticles<COP, I>>
) => CreateOrganelle<ComingParticles<COP>,ComingResponseParticle<COP>>;
