import { Particle, Log, AllInteractions, ACK } from "@euglena/core";

export type Listen = Particle<"Listen">;
export type Temperature = Particle<"Temperature">;

export type Thermometer = AllInteractions<{
    in: [[Listen,ACK]];
    out: [Temperature, Log];
}>;
