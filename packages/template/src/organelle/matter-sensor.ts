import { FromP, P, domc } from "@euglena/core";
import { PException, PLog } from "../particle/particles.h";

export type PMatter = P<
    Array<{
        pm: number;
        value: number;
        type: "Normal" | "Atmos" | "Count";
    }>
>;

export type Matter = FromP<"Matter", PMatter>;

const matterSensor = {
    v1: domc<{
        in: {
            Read: P<undefined>;
        };
        out: {
            Matter: PMatter;
            Log: PLog;
            Exception: PException;
        };
    }>(["Read"], ["Matter", "Log", "Exception"])
};

export { matterSensor };
