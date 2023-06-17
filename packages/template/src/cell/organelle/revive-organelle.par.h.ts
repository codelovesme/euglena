import { Particle } from "@euglena/core";

export type ReviveOrganelle = Particle<"ReviveOrganelle", { organelleName: string; retryCount: number; retryInterval: number; }>;
