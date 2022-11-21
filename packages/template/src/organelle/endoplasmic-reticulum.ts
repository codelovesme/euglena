import { AllInteractions, Particle, cp as _cp, ComingParticles, CreateParticleUnion } from "@euglena/core";
import { common } from "../particle";

export type TransmitParticle = Particle<"TransmitParticle", { target: string; particle: Particle }>;

export type TransmitResponse = Particle<"TransmitResponse", Particle | void>;
export type EuglenaHasBeenBorn = Particle<"EuglenaHasBeenBorn">;

export type EndoplasmicReticulum = AllInteractions<{
    in: [[TransmitParticle, any], common.OrganelleInfo];
    out: [common.Log, EuglenaHasBeenBorn];
}>;

export const createParticle = _cp as CreateParticleUnion<ComingParticles<EndoplasmicReticulum>>;
export const cp = createParticle;
