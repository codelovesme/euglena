import { AllInteractions } from "./all-interactions.h";
import { ComingParticleNameUnion } from "./in-out-particle.h";
import { OrganelleReaction } from "./reaction.h";

export type BindOrganelleReactions<COP extends AllInteractions> = {
    [CPN in ComingParticleNameUnion<COP>]: OrganelleReaction<COP, CPN>;
};

import "./bind-reaction.h.spec";