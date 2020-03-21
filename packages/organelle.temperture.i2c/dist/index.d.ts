declare const _default: import("@euglena/core").OrganelleModule<"Temperature", import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        Listen: import("@euglena/core").P<undefined, {}>;
    };
    outgoing: {
        ACK: import("@euglena/core").P<undefined, {}>;
        Temperature: import("@euglena/core").P<number, {}>;
        Log: import("@euglena/core").P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
        Exception: import("@euglena/core").P<import("cessnalib").sys.type.Exception, {}>;
    };
}, import("@euglena/core").P<{
    ic2Address: number;
    deviceAddress: number;
    interval: number;
}, {
    organelle: {
        name: string;
        nick?: string | undefined;
    };
}>>>;
export default _default;
