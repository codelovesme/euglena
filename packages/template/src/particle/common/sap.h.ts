import { particle } from "@euglena/core";

export type Sap<Data extends unknown = unknown> = particle.Particle<"Sap", Data, { organelleName: string }>;
