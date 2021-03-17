import { FromP, P } from "../../organelle/particles.h";
import { PLog, PException } from "..";
export declare type PMatter = P<Array<{
    pm: number;
    value: number;
    type: "Normal" | "Atmos" | "Count";
}>>;
export declare type Matter = FromP<"Matter", PMatter>;
declare const matterSensor: {
    v1: import("../..").CreateOrganelleModuleInterface<{
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
