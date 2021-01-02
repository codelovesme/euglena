declare const _default: import("@euglena/core").OrganelleModule<import("@euglena/core").P<{
    port: number;
}, {
    organelleName: string;
}>, import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        GetAlive: import("@euglena/core").P<undefined, {}>;
    };
    outgoing: {
        ACK: import("@euglena/core").P<undefined, {}>;
        Exception: import("@euglena/core").P<import("cessnalib").sys.type.Exception, {}>;
        Impulse: import("@euglena/core").P<{
            particle: import("@euglena/core").Particle<string, any, {
                [x: string]: any;
            }>;
            source: string;
            token: string;
        }, {}>;
        Log: import("@euglena/core").P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
    };
}, import("@euglena/core").P<{
    port: number;
}, {
    organelleName: string;
}>>>;
export default _default;
