import { CreateOrganelle, Particle } from "@euglena/core";
import { sys } from "cessnalib";

export type Particles = Particle<"Particles", Particle[]>;

export type GetAlive = Particle<"GetAlive">;

export type Exception = Particle<"Exception", sys.type.Exception>;

export type OrganelleInfo = Particle<
    "OrganelleInfo",
    {
        name: string;
        location:
            | {
                  type: "FileSystemPath" | "NodeModules" | "Url";
                  path: string;
              }
            | {
                  type: "InMemory";
                  organelle: CreateOrganelle;
              };
    }
>;

export type Sap<Data extends unknown = unknown> = Particle<"Sap", Data, { organelleName: string }>;

export type ACK = Particle<"ACK">;
export type NACK = Particle<"NACK">;
export type Log = Particle<"Log", { message: string; level: "Error" | "Info" | "Warning" }>;
