export declare const logger: import("../..").OrganelleModule<"Logger", {
    incoming: {
        LoggerLog: (message: string, level: "Error" | "Warning" | "Info") => import("../..").Particle<"LoggerLog", {
            message: string;
            level: "Error" | "Warning" | "Info";
        }, {}>;
    };
    outgoing: {
        ACK: (adds?: import("../..").MetaAdditions | undefined) => import("../..").Particle<"ACK", unknown, {}>;
        Exception: (message: string, innerException?: import("cessnalib").sys.type.Exception | undefined, adds?: import("../..").MetaAdditions | undefined) => import("../..").Particle<"Exception", import("cessnalib").sys.type.Exception, {}>;
    };
}>;
