import { FromP, P } from "./organelle.h";
import { domc } from "./organelle";
import { PLog, PException } from "../common";

export type PMatter = P<
    Array<{
        pm: number;
        value: number;
        type: "Normal" | "Atmos" | "Count";
    }>
>;

export type Matter = FromP<"Matter", PMatter>;

const matter = {
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

export { matter };
