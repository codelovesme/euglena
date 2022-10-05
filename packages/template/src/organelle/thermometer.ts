import { Particle, AllInteractions } from "@euglena/core";
import { ACK, Exception, Log } from "../particle/common.h";

export type Listen = Particle<"Listen">;
export type Temperature = Particle<"Temperature">;

export type Thermometer = AllInteractions<{
    in: [[Listen, ACK | Exception]];
    out: [Temperature, Log];
}>;
