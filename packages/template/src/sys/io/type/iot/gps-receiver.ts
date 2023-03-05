import { particle, organelle } from "@euglena/core";
import { common } from "../particle";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import CreateParticleUnion = particle.CreateParticleUnion;

export type Coordinate = particle.Particle<
    "Coordinate",
    {
        lat: number;
        lng: number;
    }
>;

export type Listen = particle.Particle<"Listen">;

export type GpsReceiver = extendOrganelleInteractions<{
    in: [[Listen, common.ACK | common.Exception]];
    out: [Coordinate, common.Log];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<GpsReceiver>>;
export const cp = createParticle;
