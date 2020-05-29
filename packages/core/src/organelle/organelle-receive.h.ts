import { Particle } from "../particle";

export interface OrganelleReceive<
    InComingParticle extends Particle = Particle,
    OutGoingParticle extends Particle = Particle
> {
    (particle: InComingParticle): Promise<OutGoingParticle | void>;
}

export interface OrganelleTransmit<P extends Particle = Particle, Resp extends Particle | void = Particle | void> {
    (particle: P): Promise<Resp>;
}

export interface NucleusTransmit<P extends Particle = Particle, Resp extends Particle | void = Particle | void> {
    (particle: P, targetOrganelle: string): Promise<Resp>;
}
