import { AllInteractions, Particle, cp as _cp, ComingParticles, CreateParticleUnion } from "@euglena/core";
import { common } from "../particle";

export type Impulse = Particle<
    "Impulse",
    {
        particle: Particle;
        source: string;
        token?: string;
    }
>;

export type NetServer = AllInteractions<{
    in: [common.GetAlive];
    out: [[Impulse, common.Particles], common.Log];
}>;

export const createParticle = _cp as CreateParticleUnion<ComingParticles<NetServer>>;
export const cp = createParticle;
