import { OrganelleInteractions } from "./organelle-interactions.h";
import { OrganelleReceive } from "./organelle-receive.h";
import { OrganelleTransmit } from "./reaction.h";
import { ComingParticles, ComingResponseParticle } from "./in-out-particle.h";
import { getClass, Particle } from "../particle";
import { ts } from "cessnalib";

export type CreateOrganelle<COP extends OrganelleInteractions = OrganelleInteractions> = <
    OrganelleName extends string
>(params: {
    name: OrganelleName;
    transmit: OrganelleTransmit<COP>;
}) => ts.UnionToIntersection<
    ComingParticles<COP> extends infer P extends Particle
        ? OrganelleReceive<P, ComingResponseParticle<COP, getClass<P>>>
        : never
>;
