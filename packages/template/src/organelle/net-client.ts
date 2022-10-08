import { Particle, AllInteractions, cp as _cp, ComingParticles, CreateParticleUnion } from "@euglena/core";
import { common } from "../particle";

export type TransmitParticle = Particle<
    "TransmitParticle",
    {
        particle: Particle;
        target: {
            host: string;
            port: number;
        };
    }
>;

export type NetClient = AllInteractions<{
    in: [[TransmitParticle, common.ACK | common.Exception]];
    out: [common.Log];
}>;

export const createParticle = _cp as CreateParticleUnion<ComingParticles<NetClient>>;
export const cp = createParticle;
