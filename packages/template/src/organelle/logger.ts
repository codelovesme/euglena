import { AllInteractions, ComingParticles, cp as _cp, CreateParticleUnion } from "@euglena/core";
import { common } from "../particle";

export type Logger = AllInteractions<{
    in: [[common.Log, common.ACK]];
    out: [];
}>;

export const createParticle = _cp as CreateParticleUnion<ComingParticles<Logger>>;
export const cp = createParticle;