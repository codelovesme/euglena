import { OrganelleInteractions } from "./organelle-interactions.h";
import { OrganelleReceive } from "./organelle-receive.h";
import { OrganelleTransmit } from "./reaction.h";
import { ComingParticleUnion, ComingParticleResponse } from "./in-out-particle.h";
import { getClass, Particle } from "../particle";
import { ts } from "cessnalib";
export type CreateOrganelle<COP extends OrganelleInteractions = OrganelleInteractions> = <OrganelleName extends string>(params: {
    name: OrganelleName;
    transmit: OrganelleTransmit<COP>;
}) => ts.UnionToIntersection<ComingParticleUnion<COP> extends infer P extends Particle ? OrganelleReceive<P, ComingParticleResponse<COP, getClass<P>>> : never>;
//# sourceMappingURL=create-organelle.h.d.ts.map