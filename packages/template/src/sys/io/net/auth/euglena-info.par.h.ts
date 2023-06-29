import { Particle } from "@euglena/core";

export type EuglenaInfo = Particle<
    "EuglenaInfo",
    {
        euglenaName: string;
        password: string;
        info:
        | {
            type: "App";
            email?: string;
        }
        | {
            type: "Human";
            email: string;
            name?: string;
            surname?: string;
            birthdate?: number;
            pictureUrl?: string;
        };
        /**
         * user,
         * admin,
         * app
         */
        roles: string[];
        status: "Active" | "NeedsVerification" | "Deactive";
    },
    {
        version: "3";
    }
>;