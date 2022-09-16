import {  Particle, AllInteractions, Log, ACK } from "@euglena/core";

export type TransmitParticle = Particle<"TransmitParticle",{
    particle: Particle;
    target: {
        host: string;
        port: number;
    };
}>

export type NetClient = AllInteractions<{
    in:[[TransmitParticle,ACK]];
    out:[Log];
}> 
