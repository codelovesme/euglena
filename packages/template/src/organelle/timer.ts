import { AllInteractions, Particle } from "@euglena/core";
import { sys } from "cessnalib";
import { ACK } from "../particle";

export type ReadTime = Particle<"ReadTime">;
export type SetTime = Particle<"SetTime", sys.type.Time>;
export type Time = Particle<"Time", sys.type.Time>;

export type Timer = AllInteractions<{
    in: [[ReadTime, Time], [SetTime, ACK]];
    out: [Time];
}>;
