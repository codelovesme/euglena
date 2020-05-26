import { PLog, PException } from "../common";
import { FromP, P } from "./organelle.h";
import { domc } from "./organelle";

export type PCoordinate = P<{
    lat: number;
    lng: number;
}>;

export type Coordinate = FromP<"Coordinate", PCoordinate>;

const gps = {
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

export { gps };
