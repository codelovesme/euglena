import { Meta, Particle } from "@euglena/core";

export type EuglenaName = Particle<"EuglenaName", string>;
export type Particles = Particle<"Particles", Particle[]>;
export type Metas = Particle<"Metas", Meta[]>;
export type NoReaction = Particle<"NoReaction">;
export type InvalidParticle = Particle<"InvalidParticle">;
export type Hibernate = Particle<"Hibernate">;
export type EuglenaInfo = Particle<
    "EuglenaInfo",
    {
        id: string;
        name: string;
        description: string;
    }
>;
export type GetAlive = Particle<"GetAlive">;
