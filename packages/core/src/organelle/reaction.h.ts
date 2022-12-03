import { ts } from "cessnalib";
import { OrganelleInteractions } from "./organelle-interactions.h";
import { CreateParticleUnion } from "../particle";
import {
    ComingParticleNameUnion,
    ComingParticle,
    GoingParticles,
    GoingResponseParticle,
    ComingResponseParticle,
    GoingParticle,
    GoingParticleNameUnion
} from "./in-out-particle.h";

export type OrganelleReactionCreateParticle<
    COP extends OrganelleInteractions,
    CPN extends ComingParticleNameUnion<COP>
> = ComingResponseParticle<COP, CPN> extends never
    ? CreateParticleUnion<GoingParticles<COP>>
    : CreateParticleUnion<GoingParticles<COP> | ComingResponseParticle<COP, CPN>>;

export type OrganelleTransmit<COP extends OrganelleInteractions> = ts.IntersectionFromUnion<
    {
        [P in GoingParticleNameUnion<COP>]: (
            particle: GoingParticle<COP, P>
        ) => Promise<GoingResponseParticle<COP> extends undefined ? void : GoingResponseParticle<COP, P>>;
    }[GoingParticleNameUnion<COP>]
>;

export interface OrganelleReaction<COP extends OrganelleInteractions, CPN extends ComingParticleNameUnion<COP>> {
    (
        particle: ComingParticle<COP, CPN>,
        tools: {
            /**
             * transmit
             */
            t: OrganelleTransmit<COP>;
            /**
             * createParticle
             */
            cp: OrganelleReactionCreateParticle<COP, CPN>;
        }
    ): Promise<ComingResponseParticle<COP, CPN> extends undefined ? void : ComingResponseParticle<COP, CPN>>;
}

import "./reaction.h.spec";

