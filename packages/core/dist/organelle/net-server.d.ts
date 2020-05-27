declare const netServer: {
    v1: import("./organelle.h").CreateOrganelleModuleInterface<{
        incoming: {
            GetAlive: import("./organelle.h").P<undefined, {}>;
        };
        outgoing: {
            ACK: import("./organelle.h").P<undefined, {}>;
            Exception: import("./organelle.h").P<import("cessnalib").sys.type.Exception, {}>;
            Impulse: import("./organelle.h").P<{
                particle: import("..").Particle<string, any, {
                    [x: string]: any;
                }>;
                source: string;
            }, {}>;
            Log: import("./organelle.h").P<{
                message: string;
                level: "Error" | "Info" | "Warning";
            }, {}>;
        };
    }, undefined>;
};
export { netServer };
