import { Particle, Log, AllInteractions } from "@euglena/core";

export type Listen = Particle<"Listen">;
export type Temperature = Particle<"Temperature">;

export type Thermometer = AllInteractions<{
    in: [Listen];
    out: [Temperature, Log];
}>;
