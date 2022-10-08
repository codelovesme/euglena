import { AllInteractions, Particle, cp as _cp, ComingParticles, CreateParticleUnion } from "@euglena/core";

import { common } from "../particle";

export type Event = Particle<"Event">;
export type Render = Particle<"Render">;

export type UI = AllInteractions<{
    in: [[Render, common.ACK | common.Exception]];
    out: [common.Log, Event];
}>;

export const createParticle = _cp as CreateParticleUnion<ComingParticles<UI>>;
export const cp = createParticle;
