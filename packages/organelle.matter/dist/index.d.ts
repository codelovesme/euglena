import { P, FromP } from "@euglena/core";
export declare type PMatter = P<Array<{
    pm: number;
    value: number;
    type: "Normal" | "Atmos" | "Count";
}>>;
export declare type Matter = FromP<"Matter", PMatter>;
declare const _default: import("@euglena/core").CreateOrganelleModuleInterface<"Matter", {
    incoming: {
        Read: P<undefined, {}>;
    };
    outgoing: {
        Matter: P<{
            pm: number;
            value: number;
            type: "Normal" | "Atmos" | "Count";
        }[], {}>;
        Log: P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
        Exception: P<import("cessnalib").sys.type.Exception, {}>;
    };
}>;
export default _default;