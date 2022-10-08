import {  Particle } from "@euglena/core";

export type Log = Particle<"Log", { message: string; level: "Error" | "Info" | "Warning" }>;


