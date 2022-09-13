import { ts } from "cessnalib";
import { AllInteractions } from "./all-interactions.h";
import { BindOrganelleReactions } from "./bind-reaction.h";
import { CreateOrganelle } from "./create-organelle.h";
import { ComingParticles, ComingResponseParticle, GoingParticleNameUnion } from "./in-out-particle.h";
import { Interaction } from "./interaction.h";
import { InsertSapIntoParticles } from "./utils";

export type DefineCreateOrganelle = <COP extends AllInteractions, I extends Interaction>(
    goingParticles: ts.TupleFromUnion<GoingParticleNameUnion<COP>>,
    bindReactions: BindOrganelleReactions<InsertSapIntoParticles<COP, I>>
) => CreateOrganelle<ComingParticles<COP>, ComingResponseParticle<COP>>;
