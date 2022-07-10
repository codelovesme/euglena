import { Particle } from "../particle";
import { OrganelleReceive } from "./organelle-receive.h";

export type CreateOrganelle<
    InComingParticle extends Particle = Particle,
    OutGoingParticle extends Particle | void = Particle | void
> = <OrganelleName extends string>(params: {
    name: OrganelleName;
    transmit: (sourceOrganelle: string, particle: Particle, targetOrganelle?: string) => Promise<Particle | void>;
}) => OrganelleReceive<InComingParticle, OutGoingParticle>;

export type CreateSingletonOrganelle<
    InComingParticle extends Particle = Particle,
    OutGoingParticle extends Particle | void = Particle | void
> = (params: {
    transmit: (sourceOrganelle: string, particle: Particle, targetOrganelle?: string) => Promise<Particle | void>;
}) => OrganelleReceive<InComingParticle, OutGoingParticle>;

export type CreateEndoplasmicReticulum<
    InComingParticle extends Particle = Particle,
    OutGoingParticle extends Particle | void = Particle | void
> = () => OrganelleReceive<InComingParticle, OutGoingParticle>;
