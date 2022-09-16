import { Exception } from "../../utils";
import { AllInteractions } from "./all-interactions.h";
import { CreateParticleUnion } from "./create-particle.h";
import {
    ComingParticleNameUnion,
    ComingParticle,
    GoingParticles,
    GoingResponseParticle,
    ComingResponseParticle
} from "./in-out-particle.h";

export type OrganelleReactionCreateParticle<
    COP extends AllInteractions,
    CPN extends ComingParticleNameUnion<COP>
> = ComingResponseParticle<COP, CPN> extends never
    ? CreateParticleUnion<GoingParticles<COP> | Exception>
    : CreateParticleUnion<GoingParticles<COP> | ComingResponseParticle<COP, CPN> | Exception>;

type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never;

export type _OrganelleTransmit<COP extends AllInteractions, CPN extends ComingParticleNameUnion<COP>> = (
    particle: GoingParticles<COP>
) => Promise<GoingResponseParticle<COP> extends undefined ? void : GoingResponseParticle<COP, CPN>>;

export type OrganelleTransmit<
    COP extends AllInteractions,
    CPN extends ComingParticleNameUnion<COP>
> = UnionToIntersection<{ [P in CPN]: _OrganelleTransmit<COP, P> }[CPN]>;

export interface OrganelleReaction<COP extends AllInteractions, CPN extends ComingParticleNameUnion<COP>> {
    (
        particle: ComingParticle<COP, CPN>,
        tools: {
            /**
             * transmit
             */
            t: OrganelleTransmit<COP,CPN>;
            /**
             * createParticle
             */
            cp: OrganelleReactionCreateParticle<COP, CPN>;
        }
    ): Promise<
        Exception | (ComingResponseParticle<COP, CPN> extends undefined ? void : ComingResponseParticle<COP, CPN>)
    >;
}

import "./reaction.h.spec";
