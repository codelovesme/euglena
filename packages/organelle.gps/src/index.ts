import { domc, P, FromP, PLog, PException } from "@euglena/core";

export type PCoordinate = P<{
    lat: number;
    lng: number;
}>;

export type Coordinate = FromP<"Coordinate", PCoordinate>;

export default domc("GPS")<{
    incoming: {
        Listen: P<undefined>;
    };
    outgoing: {
        Coordinate: PCoordinate;
        Log: PLog;
        Exception: PException;
    };
}>(["Listen"], ["Coordinate", "Log", "Exception"]);
