import { FromP, P } from "../../organelle/particles.h";
import { domc } from "../../organelle/define-organelle-module-create";
import { PLog, PException } from "..";

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
        incoming: {
            Read: P<undefined>;
        };
        outgoing: {
            Matter: PMatter;
            Log: PLog;
            Exception: PException;
        };
    }>(["Read"], ["Matter", "Log", "Exception"])
};

export { matterSensor };
