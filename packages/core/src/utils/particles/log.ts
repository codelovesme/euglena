import { Particle } from "../../types";

export type Log = Particle<"Log", { message: string; level: "Error" | "Info" | "Warning" }>;
