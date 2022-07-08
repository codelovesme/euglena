import { domc, FromP, P } from "@euglena/core";
import { PException, PLog } from "../particle";

export type PCoordinate = P<{
    lat: number;
    lng: number;
}>;

export type Coordinate = FromP<"Coordinate", PCoordinate>;

const gpsReceiver = {
    v1: domc<{
        incoming: {
            Listen: P<undefined>;
        };
        outgoing: {
            Coordinate: PCoordinate;
            Log: PLog;
            Exception: PException;
        };
    }>(["Listen"], ["Coordinate", "Log", "Exception"])
};

export { gpsReceiver };
