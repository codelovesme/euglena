import { P } from "../..";
import { Particle } from "../../..";
import { FromP, Sap } from "../../particles.h";
import { OrganelleModule } from "../../organelle-module.h";

export type PEuglenaHasBeenBorn = P;
export type PTransmitParticle = P<{ target: string; particle: Particle }>;
export type POrganelleInfo = P<{
    name: string;
    location:
        | {
              type: "FileSystemPath" | "NodeModules" | "Url";
              path: string;
          }
        | {
              type: "InMemory";
              organelle: OrganelleModule<Sap>;
          };
}>;
export type PTransmitResponse = P<Particle | void>;

export type TransmitParticle = FromP<"TransmitParticle", PTransmitParticle>;
export type OrganelleInfo = FromP<"OrganelleInfo", POrganelleInfo>;
export type TransmitResponse = FromP<"TransmitResponse", PTransmitResponse>;
export type EuglenaHasBeenBorn = FromP<"EuglenaHasBeenBorn", PEuglenaHasBeenBorn>;
