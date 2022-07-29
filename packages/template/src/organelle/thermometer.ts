import { Particle, Log } from "@euglena/core";

export type Listen = Particle<"Listen">;
export type Temperature = Particle<"Temperature">;

export type Thermometer = {
    in: [Listen];
    out: [Temperature, Log];
};
