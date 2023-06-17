import { Particle } from "../particle";

export interface OrganelleReceive<
    InComingParticle extends Particle = Particle,
    ComingParticleResponse extends Particle | never = Particle
> {
    (particle: InComingParticle): Promise<ComingParticleResponse extends never ? void : ComingParticleResponse>;
}