import { OrganelleInteractions } from "./organelle-interactions.h";
import { ComingParticleNameUnion } from "./in-out-particle.h";
import { OrganelleReaction } from "./reaction.h";
export type BindOrganelleReactions<COP extends OrganelleInteractions> = {
    [CPN in ComingParticleNameUnion<COP>]: OrganelleReaction<COP, CPN>;
};
import "./bind-reaction.h.spec";
//# sourceMappingURL=bind-reaction.h.d.ts.map