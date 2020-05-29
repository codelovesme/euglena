import { FromP, P } from "./particles.h";
export declare type PCoordinate = P<{
    lat: number;
    lng: number;
}>;
export declare type Coordinate = FromP<"Coordinate", PCoordinate>;
declare const gps: {
    v1: any;
};
export { gps };
