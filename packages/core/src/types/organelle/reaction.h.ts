import { Exception } from "../../utils";
import { AllInteractions } from "./all-interactions.h";
import { CreateParticleWithoutClass } from "./create-particle.h";
import {
    ComingParticleNameUnion,
    ComingParticle,
    GoingParticles,
    GoingResponseParticle,
    GoingParticleNameUnion,
    GoingParticle,
    ComingResponseParticleNameUnion,
    ComingResponseParticle
} from "./in-out-particle.h";
import { OrganelleTransmit } from "./organelle-receive.h";

export interface OrganelleReaction<COP extends AllInteractions, CPN extends ComingParticleNameUnion<COP>> {
    (
        particle: ComingParticle<COP, CPN>,
        tools: {
            /**
             * transmit
             */
            t: OrganelleTransmit<
                GoingParticles<COP>,
                GoingResponseParticle<COP> extends undefined ? void : GoingResponseParticle<COP>
            >;
            /**
             * createParticle
             */
            cp: {
                [P in GoingParticleNameUnion<COP>]: CreateParticleWithoutClass<GoingParticle<COP, P>>;
            } & {
                [P in ComingResponseParticleNameUnion<COP>]: CreateParticleWithoutClass<
                    ComingResponseParticle<COP, CPN>
                >;
            } & {
                Exception: CreateParticleWithoutClass<Exception>;
            };
        }
    ): Promise<
        Exception | (ComingResponseParticle<COP, CPN> extends undefined ? void : ComingResponseParticle<COP, CPN>)
    >;
}

import "./reaction.h.spec"