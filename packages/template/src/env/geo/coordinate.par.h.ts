import { Particle } from "@euglena/core";

export type Coordinate = Particle<
    "Coordinate",
    {
        lat: number;
        lng: number;
    }
>;