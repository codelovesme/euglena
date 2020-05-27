import { P } from "./organelle.h";
declare const temperature: {
    v1: import("./organelle.h").CreateOrganelleModuleInterface<{
        incoming: {
            Listen: P<undefined, {}>;
        };
        outgoing: {
            ACK: P<undefined, {}>;
            Temperature: P<number, {}>;
            Log: P<{
                message: string;
                level: "Error" | "Info" | "Warning";
            }, {}>;
            Exception: P<import("cessnalib").sys.type.Exception, {}>;
        };
    }, undefined>;
};
export { temperature };
