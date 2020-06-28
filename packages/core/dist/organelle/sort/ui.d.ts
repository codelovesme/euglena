import { P, FromP } from "../particles.h";
declare type PEvent = P;
export declare type Event = FromP<"Event", PEvent>;
declare const ui: {
    v1: import("..").CreateOrganelleModuleInterface<{
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
    }, undefined>;
};
export { ui };
