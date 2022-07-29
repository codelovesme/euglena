import { AllInteractions, Log, Particle } from "@euglena/core";

export type Read = Particle<"Read">;

export type Matter = Particle<
    "Matter",
    Array<{
        pm: number;
        value: number;
        type: "Normal" | "Atmos" | "Count";
    }>
>;

export type MatterSensor = AllInteractions<{
    in: [Read, Matter];
    out: [Log];
}>;
