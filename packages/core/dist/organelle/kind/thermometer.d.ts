import { P } from "../particles.h";
declare const thermometer: {
    v1: import("..").CreateOrganelleModuleInterface<{
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
export { thermometer };
