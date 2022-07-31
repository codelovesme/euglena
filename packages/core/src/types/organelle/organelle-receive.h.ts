import { Particle } from "../particle.h";

export interface OrganelleReceive<
    InComingParticle extends Particle = Particle,
    OutGoingParticle extends Particle | void = Particle | void
> {
    (particle: InComingParticle): Promise<OutGoingParticle>;
}

export interface OrganelleTransmit<P extends Particle = Particle, Resp extends Particle | void = Particle | void> {
    (particle: P): Promise<Resp>;
}