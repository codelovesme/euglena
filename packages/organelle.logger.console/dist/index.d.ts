declare const _default: import("@euglena/core").OrganelleModule<import("@euglena/core").InsertSapIntoParticles<{
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
    organelleName: string;
}>>>;
export default _default;
