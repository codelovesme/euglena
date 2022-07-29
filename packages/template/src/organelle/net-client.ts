import {  Particle, AllInteractions, Log } from "@euglena/core";

export type TransmitParticle = Particle<"TransmitParticle",{
    particle: Particle;
    target: {
        host: string;
        port: number;
    };
}>

export type NetClient = AllInteractions<{
    in:[TransmitParticle];
    out:[Log];
}> 
