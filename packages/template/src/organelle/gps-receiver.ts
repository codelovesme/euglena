import { AllInteractions, Particle } from "@euglena/core";
import { ACK, Exception, Log } from "../particle";

export type Namespace = "GpsReceiver";

export type Coordinate = Particle<
    "Coordinate",
    {
        lat: number;
        lng: number;
    }
>;

export type Listen = Particle<"Listen", { namespace: Namespace }>;

export type GpsReceiver = AllInteractions<{
    in: [[Listen, ACK | Exception]];
    out: [Coordinate, Log];
}>;
