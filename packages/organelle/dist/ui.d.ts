import { P, FromP } from "@euglena/core";
declare type PEvent = P;
export declare type Event = FromP<"Event", PEvent>;
declare const ui: import("@euglena/core").CreateOrganelleModuleInterface<"UI", {
    incoming: {
        Render: P<any, {}>;
    };
    outgoing: {
        ACK: P<undefined, {}>;
        Exception: P<import("cessnalib").sys.type.Exception, {}>;
        Log: P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
        Event: P<any, {}>;
    };
}>;
export { ui };
