import { Particle } from "@euglena/core";

export type ReviveOrganelle = Particle<
    "ReviveOrganelle",
    {
        retryInterval?: number;
        retryCount: number;
        organelleName: string;
    }
>;