declare const _default: import("@euglena/core").OrganelleModule<import("@euglena/core").P<undefined, {
    organelleName: string;
}>, import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        TransmitParticle: import("@euglena/core").P<{
            particle: import("@euglena/core").Particle<string, unknown, {}>;
            target: {
                host: string;
                port: number;
            };
        }, {}>;
    };
    outgoing: {
        ACK: import("@euglena/core").P<undefined, {}>;
        Exception: import("@euglena/core").P<import("cessnalib").sys.type.Exception, {}>;
        Log: import("@euglena/core").P<{
            message: string;
            level: "Info" | "Error" | "Warning";
        }, {}>;
    };
}, import("@euglena/core").P<undefined, {
    organelleName: string;
}>>>;
export default _default;
