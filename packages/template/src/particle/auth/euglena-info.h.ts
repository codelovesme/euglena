import { particle } from "@euglena/core";

export type EuglenaInfo = particle.Particle<
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
                  name: string;
                  surname: string;
                  birthdate: number;
                  pictureUrl: string;
              };
        roles: string[];
        status: "Active" | "NeedsVerification" | "Deactive";
    },
    {
        version: "2.0";
    }
>;