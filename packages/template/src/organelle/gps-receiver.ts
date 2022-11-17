import { AllInteractions, Particle, cp as _cp, ComingParticles, CreateParticleUnion } from "@euglena/core";
import { common } from "../particle";

export type Coordinate = Particle<
    "Coordinate",
    {
        lat: number;
        lng: number;
    }
>;

export type Listen = Particle<"Listen">;

export type GpsReceiver = AllInteractions<{
    in: [[Listen, common.ACK | common.Exception]];
    out: [Coordinate, common.Log];
}>;

export const createParticle = _cp as CreateParticleUnion<ComingParticles<GpsReceiver>>;
export const cp = createParticle;
