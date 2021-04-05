import { PLog, PException } from "..";
import { FromP, P } from "../../organelle/particles.h";
export declare type PCoordinate = P<{
    lat: number;
    lng: number;
}>;
export declare type Coordinate = FromP<"Coordinate", PCoordinate>;
declare const gpsReceiver: {
    v1: import("../..").CreateOrganelleModuleInterface<{
        incoming: {
            Listen: P<undefined>;
        };
        outgoing: {
            Coordinate: PCoordinate;
            Log: PLog;
            Exception: PException;
        };
    }, undefined>;
};
export { gpsReceiver };