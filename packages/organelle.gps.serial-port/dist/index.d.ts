declare const _default: import("@euglena/core").OrganelleModule<"GPS", import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        Listen: import("@euglena/core").P<undefined, {}>;
    };
    outgoing: {
        Coordinate: import("@euglena/core").P<{
            lat: number;
            lng: number;
        }, {}>;
        Log: import("@euglena/core").P<{
            message: string;
            level: "Info" | "Error" | "Warning";
        }, {}>;
        Exception: import("@euglena/core").P<import("cessnalib").sys.type.Exception, {}>;
    };
}, import("@euglena/core").P<{
    path: string;
    interval: number;
}, {
    organelle: {
        name: string;
        nick?: string | undefined;
    };
}>>>;
export default _default;
