declare const logger: import("@euglena/core").CreateOrganelleModuleInterface<"Logger", {
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
}>;
export { logger };
