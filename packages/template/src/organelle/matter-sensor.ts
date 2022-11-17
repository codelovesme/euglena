import { AllInteractions, Particle, cp as _cp, ComingParticles, CreateParticleUnion } from "@euglena/core";
import { common } from "../particle";

export type Read = Particle<"Read">;

export type Matter = Particle<
    "Matter",
    Array<{
        pm: number;
        value: number;
        type: "Normal" | "Atmos" | "Count";
    }>
>;

export type MatterSensor = AllInteractions<{
    in: [[Read, Matter]];
    out: [common.Log];
}>;

export const createParticle = _cp as CreateParticleUnion<ComingParticles<MatterSensor>>;
export const cp = createParticle;
