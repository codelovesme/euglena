declare const _default: import("@euglena/organelle").OrganelleModule<"Logger", import("@euglena/organelle").InsertSapIntoParticles<{
    incoming: {
        Log: (message: string, level: "Error" | "Warning" | "Info") => import("@euglena/particle").Particle<"Log", {
            message: string;
            level: "Error" | "Warning" | "Info";
        }, {}>;
    };
    outgoing: {
        ACK: (adds?: import("@euglena/particle").MetaAdditions | undefined) => import("@euglena/particle").Particle<"ACK", undefined, import("@euglena/particle").MetaAdditions>;
        Exception: (message: string, innerException?: import("cessnalib").sys.type.Exception | undefined, adds?: import("@euglena/particle").MetaAdditions | undefined) => import("@euglena/particle").Particle<"Exception", import("cessnalib").sys.type.Exception, import("@euglena/particle").MetaAdditions>;
    };
}, unknown>>;
export default _default;
