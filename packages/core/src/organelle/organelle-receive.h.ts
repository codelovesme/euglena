import { Particle } from "../particle";

export interface OrganelleReceive<
    InComingParticle extends Particle = Particle,
    ComingResponseParticle extends Particle | never = Particle
> {
    (particle: InComingParticle): Promise<ComingResponseParticle extends never ? void : ComingResponseParticle>;
}