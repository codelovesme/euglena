import { Particle } from "@euglena/core";

export type Sap<Data extends unknown = unknown> = Particle<"Sap", Data, { organelleName: string }>;
