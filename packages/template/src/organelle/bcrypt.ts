import { AllInteractions, ComingParticles, Particle, cp as _cp, CreateParticleUnion } from "@euglena/core";

export type Hash = Particle<"Hash", string>;
export type Compare = Particle<
    "Compare",
    {
        plainPassword: string;
        hashedPassword: string;
    }
>;
export type HashedPassword = Particle<"HashedPassword", string>;
export type CompareResult = Particle<"CompareResult", boolean>;

export type Bcrypt = AllInteractions<{
    in: [[Hash, HashedPassword], [Compare, CompareResult]];
    out: [];
}>;

export const createParticle = _cp as CreateParticleUnion<ComingParticles<Bcrypt>>;
export const cp = createParticle;
