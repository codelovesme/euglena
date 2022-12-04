import { particle, organelle } from "@euglena/core";
import { common } from "../particle";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import Particle = particle.Particle;
import CreateParticleUnion = particle.CreateParticleUnion;

export type TransmitParticle = particle.Particle<
    "TransmitParticle",
    {
        particle: Particle;
        target: {
            host: string;
            port: number;
        };
    }
>;

export type NetClient = extendOrganelleInteractions<{
    in: [[TransmitParticle, common.ACK | common.Exception]];
    out: [common.Log];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<NetClient>>;
export const cp = createParticle;
