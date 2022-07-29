import { Particle } from "../particle.h";

export interface OrganelleReceive<
    InComingParticle extends Particle = Particle,
    OutGoingParticle extends Particle | void = Particle | void
> {
    (particle: InComingParticle): Promise<OutGoingParticle>;
}

export interface OrganelleTransmit<P extends Particle<string,any> = Particle<string,any>, Resp extends Particle<string,any> | void = Particle<string,any> | void> {
    (particle: P): Promise<Resp>;
}