declare const _default: import("@euglena/core").OrganelleModule<import("@euglena/core").P<{
    ic2Address: number;
    deviceAddress: number;
    interval: number;
}, {
    organelleName: string;
}>, import("@euglena/core").InsertSapIntoParticles<{
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
    organelleName: string;
}>>>;
export default _default;
