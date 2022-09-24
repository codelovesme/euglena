import { Particle } from "@euglena/core";
import { DecryptedToken } from "../../../jwt";

export type EuglenaInfoV2 = Particle<
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

export type Session = Particle<
    "Session",
    {
        encryptedToken: string;
        decryptedToken: DecryptedToken["data"];
    }
>;

export type Permission = Particle<
    "Permission",
    {
        /**
         * Allowed particles to receive
         */
        particles: string[];
        sender:
            | {
                  /**
                   * Role name
                   * Should be unique in the whole database, across the applications
                   * @example
                   * AuthAdmin
                   */
                  role: string;
              }
            | { euglenaName: string };
        receiverEuglenaName: string;
    }
>;