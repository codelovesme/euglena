import { AllInteractions, Particle } from "@euglena/core";
import { Log, OrganelleInfo } from "../particle/common.h";
export type Namespace = "EndoplasmicReticulum";

export type TransmitParticle = Particle<
    "TransmitParticle",
    { target: string; particle: Particle },
    { namespace: Namespace }
>;

export type TransmitResponse = Particle<"TransmitResponse", Particle | void, { namespace: Namespace }>;
export type EuglenaHasBeenBorn = Particle<"EuglenaHasBeenBorn", { namespace: Namespace }>;


export type EndoplasmicReticulum = AllInteractions<{
    in: [[TransmitParticle, TransmitResponse], OrganelleInfo];
    out: [Log, EuglenaHasBeenBorn];
}>;
