import { Particle } from "../particle";

export interface OrganelleReceive<
    InComingParticle extends Particle = Particle,
    OutGoingParticle extends Particle | void = Particle | void
> {
    (particle: InComingParticle): Promise<OutGoingParticle>;
}

export interface Transmit<P extends Particle = Particle, Resp extends Particle | void = Particle | void> {
    (particle: P, target: string): Promise<Resp>;
}
