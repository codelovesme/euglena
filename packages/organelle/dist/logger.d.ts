declare const logger: {
    v1: import("@euglena/core").CreateOrganelleModuleInterface<{
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
};
export { logger };
