import { P, FromP } from "./organelle.h";
declare type PEvent = P;
export declare type Event = FromP<"Event", PEvent>;
declare const ui: {
    v1: import("./organelle.h").CreateOrganelleModuleInterface<{
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
};
export { ui };
