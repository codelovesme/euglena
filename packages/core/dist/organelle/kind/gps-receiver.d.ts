import { FromP, P } from "../particles.h";
export declare type PCoordinate = P<{
    lat: number;
    lng: number;
}>;
export declare type Coordinate = FromP<"Coordinate", PCoordinate>;
declare const gpsReceiver: {
    v1: import("..").CreateOrganelleModuleInterface<{
        incoming: {
            Listen: P<undefined, {}>;
        };
        outgoing: {
            Coordinate: P<{
                lat: number;
                lng: number;
            }, {}>;
            Log: P<{
                message: string;
                level: "Error" | "Info" | "Warning";
            }, {}>;
            Exception: P<import("cessnalib").sys.type.Exception, {}>;
        };
    }, undefined>;
};
export { gpsReceiver };
