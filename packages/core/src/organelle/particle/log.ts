import { Particle } from "../../particle";

export type Log = Particle<"Log", { message: string; level: "Error" | "Info" | "Warning" }>;
