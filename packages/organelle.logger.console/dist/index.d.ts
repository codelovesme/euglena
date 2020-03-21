declare const _default: import("@euglena/core").OrganelleModule<"Logger", import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        Log: import("@euglena/core").P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
    };
    outgoing: {
        ACK: import("@euglena/core").P<undefined, {}>;
        Exception: import("@euglena/core").P<import("cessnalib").sys.type.Exception, {}>;
    };
}, import("@euglena/core").P<{
    test: boolean;
}, {
    organelle: {
        name: string;
        nick?: string | undefined;
    };
}>>>;
export default _default;
