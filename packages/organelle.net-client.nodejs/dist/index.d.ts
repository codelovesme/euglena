declare const _default: import("@euglena/core").OrganelleModule<"NetClient", import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        TransmitParticle: import("@euglena/core").P<{
            particle: import("@euglena/core").Particle<string, any, {
                [x: string]: any;
            }>;
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
    organelle: {
        name: string;
        nick?: string | undefined;
    };
}>>>;
export default _default;
