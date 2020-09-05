declare const logger: {
    v1: import("..").CreateOrganelleModuleInterface<{
        incoming: {
            Log: import("..").P<{
                message: string;
                level: "Error" | "Info" | "Warning";
            }, {}>;
        };
        outgoing: {
            ACK: import("..").P<undefined, {}>;
            Exception: import("..").P<import("cessnalib").sys.type.Exception, {}>;
        };
    }, undefined>;
};
export { logger };
