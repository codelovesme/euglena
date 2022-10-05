import { Particle, AllInteractions } from "@euglena/core";
import { ACK, Exception, Log } from "../particle/common.h";

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
    in: [[TransmitParticle, ACK | Exception]];
    out: [Log];
}>;
