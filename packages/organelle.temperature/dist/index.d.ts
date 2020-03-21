import { P } from "@euglena/core";
declare const _default: import("@euglena/core").CreateOrganelleModuleInterface<"Temperature", {
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
export default _default;
