import { Particle } from "@euglena/core";

export type Matter = Particle<
    "Matter",
    Array<{
        pm: number;
        value: number;
        type: "Normal" | "Atmos" | "Count";
    }>
>;
