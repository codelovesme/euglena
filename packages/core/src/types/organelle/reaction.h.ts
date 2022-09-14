import { Exception } from "../../utils";
import { AllInteractions } from "./all-interactions.h";
import {
    ComingParticleNameUnion,
    ComingParticle,
    GoingParticles,
    GoingResponseParticle,
    ComingResponseParticle
} from "./in-out-particle.h";

// export type OrganelleReactionCreateParticle<COP extends AllInteractions, CPN extends ComingParticleNameUnion<COP>> = {
//     [P in GoingParticleNameUnion<COP>]: CreateParticleWithoutClass<GoingParticle<COP, P>>;
// } & {
//     [P in ComingResponseParticleNameUnion<COP>]: CreateParticleWithoutClass<
//         ComingResponseParticle<COP, CPN>
//     >;
// } & {
//     Exception: CreateParticleWithoutClass<Exception>;
// }

export interface OrganelleReaction<COP extends AllInteractions, CPN extends ComingParticleNameUnion<COP>> {
    (
        particle: ComingParticle<COP, CPN>,
        tools: {
            /**
             * transmit
             */
            t: (
                particle: GoingParticles<COP>
            ) => Promise<GoingResponseParticle<COP> extends undefined ? void : GoingResponseParticle<COP>>;
            /**
             * createParticle
             */
            // cp: OrganelleReactionCreateParticle<COP,CPN>;
        }
    ): Promise<
        Exception | (ComingResponseParticle<COP, CPN> extends undefined ? void : ComingResponseParticle<COP, CPN>)
    >;
}

import "./reaction.h.spec";
