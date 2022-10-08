import { AllInteractions, ComingParticles, Particle, cp as _cp, CreateParticleUnion } from "@euglena/core";
import { common } from "../particle";

export type ReceiveParticle = Particle<"ReceiveParticle", { particle: Particle; source: string }>;

export type Nucleus = AllInteractions<{
    in: [[ReceiveParticle, common.Particles]];
    out: [common.Log];
}>;

export const createParticle = _cp as CreateParticleUnion<ComingParticles<Nucleus>>;
export const cp = createParticle;
