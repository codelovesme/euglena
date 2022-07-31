import { AllInteractions } from "./all-interactions.h";
import { BindOrganelleReactions } from "./bind-reaction.h";
import { CreateOrganelle } from "./create-organelle.h";
import { ComingParticles, ComingResponseParticle } from "./in-out-particle.h";
import { Interaction } from "./interaction.h";
import { InsertSapIntoParticles } from "./utils";

export type DefineCreateOrganelle = <COP extends AllInteractions, I extends Interaction>(
    bindReactions: BindOrganelleReactions<InsertSapIntoParticles<COP, I>>
) => CreateOrganelle<ComingParticles<COP>,ComingResponseParticle<COP>>;

import "./define-create-organelle.h.spec"