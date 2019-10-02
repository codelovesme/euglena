import { MetaAdditions } from "@euglena/particle";
declare const _default: import("@euglena/organelle").CreateOrganelleModuleInterface<"GPS", {
    incoming: {};
    outgoing: {
        Coordinate: (lat: number, lng: number, adds?: MetaAdditions | undefined) => import("@euglena/particle").Particle<"Coordinate", {
            lat: number;
            lng: number;
        }, MetaAdditions>;
        Log: (message: string, level: "Info" | "Error" | "Warning", adds?: MetaAdditions | undefined) => import("@euglena/particle").Particle<"Log", {
            message: string;
            level: "Info" | "Error" | "Warning";
        }, MetaAdditions>;
    };
}>;
export default _default;
