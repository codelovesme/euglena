import { particle } from "@euglena/core";

export type ReviveOrganelle = particle.Particle<
    "ReviveOrganelle",
    {
        retryInterval?: number;
        retryCount: number;
        organelleName: string;
    }
>;