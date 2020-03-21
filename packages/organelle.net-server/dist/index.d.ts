declare const _default: import("@euglena/core").CreateOrganelleModuleInterface<"NetServer", {
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
        }, {}>;
        Log: import("@euglena/core").P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
    };
}>;
export default _default;