import {  particle } from "@euglena/core";

export type Log = particle.Particle<"Log", { message: string; level: "Error" | "Info" | "Warning" }>;


