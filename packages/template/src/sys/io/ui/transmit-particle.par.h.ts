import { Particle } from "@euglena/core";

export type TransmitParticle = Particle<"TransmitParticle", { target: string; particle: Particle }>;
