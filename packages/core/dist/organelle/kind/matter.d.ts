import { FromP, P } from "../particles.h";
export declare type PMatter = P<Array<{
    pm: number;
    value: number;
    type: "Normal" | "Atmos" | "Count";
}>>;
export declare type Matter = FromP<"Matter", PMatter>;
declare const matter: {
    v1: import("..").CreateOrganelleModuleInterface<{
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
    }, undefined>;
};
export { matter };
