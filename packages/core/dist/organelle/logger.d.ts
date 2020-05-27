declare const logger: {
    v1: import("./organelle.h").CreateOrganelleModuleInterface<{
        incoming: {
            Log: import("./organelle.h").P<{
                message: string;
                level: "Error" | "Info" | "Warning";
            }, {}>;
        };
        outgoing: {
            ACK: import("./organelle.h").P<undefined, {}>;
            Exception: import("./organelle.h").P<import("cessnalib").sys.type.Exception, {}>;
        };
    }, undefined>;
};
export { logger };
