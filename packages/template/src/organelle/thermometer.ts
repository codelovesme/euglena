import { Particle, AllInteractions, cp as _cp, ComingParticles, CreateParticleUnion } from "@euglena/core";
import { common } from "../particle";

export type Listen = Particle<"Listen">;
export type Temperature = Particle<"Temperature">;

export type Thermometer = AllInteractions<{
    in: [[Listen, common.ACK | common.Exception]];
    out: [Temperature, common.Log];
}>;

export const createParticle = _cp as CreateParticleUnion<ComingParticles<Thermometer>>;
export const cp = createParticle;
