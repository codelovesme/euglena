import { Particle } from "@euglena/core";

export type GetMyApi = Particle<
    "GetMyApi",
    {
        /**
         * The euglena who requested the api
         */
        for: string;
    }
>;
