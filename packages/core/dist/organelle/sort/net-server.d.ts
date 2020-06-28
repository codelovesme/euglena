declare const netServer: {
    v1: import("..").CreateOrganelleModuleInterface<{
        incoming: {
            GetAlive: import("..").P<undefined, {}>;
        };
        outgoing: {
            ACK: import("..").P<undefined, {}>;
            Exception: import("..").P<import("cessnalib").sys.type.Exception, {}>;
            Impulse: import("..").P<{
                particle: import("../..").Particle<string, any, {
                    [x: string]: any;
                }>;
                source: string;
            }, {}>;
            Log: import("..").P<{
                message: string;
                level: "Error" | "Info" | "Warning";
            }, {}>;
        };
    }, undefined>;
};
export { netServer };
