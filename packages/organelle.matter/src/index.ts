import { domc, P, FromP, PLog, PException } from "@euglena/core";

export type PMatter = P<
    Array<{
        pm: number;
        value: number;
        type: "Normal" | "Atmos" | "Count";
    }>
>;

export type Matter = FromP<"Matter", PMatter>;

export default domc("Matter")<{
    incoming: {
        Read: P<undefined>;
    };
    outgoing: {
        Matter: PMatter;
        Log: PLog;
        Exception: PException;
    };
}>(["Read"], ["Matter", "Log", "Exception"]);