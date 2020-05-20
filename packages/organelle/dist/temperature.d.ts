import { P } from "@euglena/core";
declare const temperature: {
    v1: import("@euglena/core").CreateOrganelleModuleInterface<{
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
    }>;
};
export { temperature };
