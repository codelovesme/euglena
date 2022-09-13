import { AllInteractions, Log, Particle } from "@euglena/core";

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
    in: [];
    out: [Coordinate, Log];
}>;
