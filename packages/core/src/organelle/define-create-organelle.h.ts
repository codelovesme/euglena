import { OrganelleInteractions } from "./organelle-interactions.h";
import { BindOrganelleReactions } from "./bind-reaction.h";
import { CreateOrganelle } from "./create-organelle.h";
import { Interaction } from "./interaction.h";

export type InsertSapIntoParticles<COP extends OrganelleInteractions, I extends Interaction> = {
    in: [I, ...COP["in"]];
    out: COP["out"];
};

export type DefineCreateOrganelle = <COP extends OrganelleInteractions, I extends Interaction>(
    bindReactions: BindOrganelleReactions<InsertSapIntoParticles<COP, I>>
) => CreateOrganelle;

import "./define-create-organelle.h.spec";
