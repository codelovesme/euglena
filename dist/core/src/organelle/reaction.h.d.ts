import { ts } from "cessnalib";
import { OrganelleInteractions } from "./organelle-interactions.h";
import { CreateParticleUnion } from "../particle";
import { ComingParticleNameUnion, ComingParticle, GoingParticleUnion, GoingParticleResponse, ComingParticleResponse, GoingParticle, GoingParticleNameUnion } from "./in-out-particle.h";
export type OrganelleReactionCreateParticle<COP extends OrganelleInteractions, CPN extends ComingParticleNameUnion<COP>> = ComingParticleResponse<COP, CPN> extends never ? CreateParticleUnion<GoingParticleUnion<COP>> : CreateParticleUnion<GoingParticleUnion<COP> | ComingParticleResponse<COP, CPN>>;
export type OrganelleTransmit<COP extends OrganelleInteractions = OrganelleInteractions> = ts.IntersectionFromUnion<{
    [P in GoingParticleNameUnion<COP>]: (particle: GoingParticle<COP, P>) => Promise<GoingParticleResponse<COP> extends undefined ? void : GoingParticleResponse<COP, P>>;
}[GoingParticleNameUnion<COP>]>;
export interface OrganelleReaction<COP extends OrganelleInteractions, CPN extends ComingParticleNameUnion<COP>> {
    (particle: ComingParticle<COP, CPN>, tools: {
        /**
         * transmit
         */
        t: OrganelleTransmit<COP>;
        /**
         * createParticle
         */
        cp: OrganelleReactionCreateParticle<COP, CPN>;
    }): Promise<ComingParticleResponse<COP, CPN> extends undefined ? void : ComingParticleResponse<COP, CPN>>;
}
import "./reaction.h.spec";
//# sourceMappingURL=reaction.h.d.ts.map