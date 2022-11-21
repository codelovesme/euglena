import { Particle } from "../particle.h";
import { OrganelleReceive } from "./organelle-receive.h";

export type CreateOrganelle<
    InComingParticle extends Particle = Particle,
    OutGoingParticle extends Particle | void = Particle | void
> = <OrganelleName extends string>(params: {
    name: OrganelleName;
    transmit: (particle: Particle) => Promise<Particle | void>;
}) => OrganelleReceive<InComingParticle, OutGoingParticle>;