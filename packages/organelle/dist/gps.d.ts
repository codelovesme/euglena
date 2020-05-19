import { P, FromP } from "@euglena/core";
export declare type PCoordinate = P<{
    lat: number;
    lng: number;
}>;
export declare type Coordinate = FromP<"Coordinate", PCoordinate>;
declare const gps: {
    v1: import("@euglena/core").CreateOrganelleModuleInterface<"GPS", {
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
    }>;
};
export { gps };
