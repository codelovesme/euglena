import { FromP, P } from "../particles.h";
import { PLog, PException } from "../../common";
export declare type PMatter = P<Array<{
    pm: number;
    value: number;
    type: "Normal" | "Atmos" | "Count";
}>>;
export declare type Matter = FromP<"Matter", PMatter>;
declare const matterSensor: {
    v1: import("..").CreateOrganelleModuleInterface<{
        incoming: {
            Read: P<undefined>;
        };
        outgoing: {
            Matter: PMatter;
            Log: PLog;
            Exception: PException;
        };
    }, undefined>;
};
export { matterSensor };
