import { AllInteractions, ComingParticles, Particle, cp as _cp, CreateParticleUnion } from "@euglena/core";
import { sys } from "cessnalib";

import { common } from "../particle";

export type ReadTime = Particle<"ReadTime">;
export type SetTime = Particle<"SetTime", sys.type.Time>;

export type Time = Particle<"Time", sys.type.Time>;
export type Timer = AllInteractions<{
    in: [[ReadTime, Time], [SetTime, common.ACK]];
    out: [Time];
}>;

export const createParticle = _cp as CreateParticleUnion<ComingParticles<Timer>>;
export const cp = createParticle;
