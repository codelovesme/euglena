declare const _default: import("@euglena/organelle").OrganelleModule<"GPS", import("@euglena/organelle").InsertSapIntoParticles<{
    incoming: {};
    outgoing: {
        Coordinate: (lat: number, lng: number, adds?: import("@euglena/particle").MetaAdditions | undefined) => import("@euglena/particle").Particle<"Coordinate", {
            lat: number;
            lng: number;
        }, import("@euglena/particle").MetaAdditions>;
        Log: (message: string, level: "Info" | "Error" | "Warning", adds?: import("@euglena/particle").MetaAdditions | undefined) => import("@euglena/particle").Particle<"Log", {
            message: string;
            level: "Info" | "Error" | "Warning";
        }, import("@euglena/particle").MetaAdditions>;
    };
}, {
    path: string;
}>>;
export default _default;
