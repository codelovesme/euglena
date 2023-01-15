import { particle } from "@euglena/core";

export type GetMyApi = particle.Particle<
    "GetMyApi",
    {
        /**
         * The euglena who requested the api
         */
        for: string;
    }
>;
