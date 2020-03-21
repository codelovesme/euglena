import { domc, P } from "..";
import { Particle, PLog } from "../..";
import { OrganelleModule, FromP } from "../organelle.h";

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
              organelle: OrganelleModule;
          };
    nick?: string;
}>;
export type PTransmitResponse = P<Particle | void>;

export type TransmitParticle = FromP<"TransmitParticle", PTransmitParticle>;
export type OrganelleInfo = FromP<"OrganelleInfo", POrganelleInfo>;
export type TransmitResponse = FromP<"TransmitResponse", PTransmitResponse>;
export type EuglenaHasBeenBorn = FromP<"EuglenaHasBeenBorn", PEuglenaHasBeenBorn>;

export default domc("EndoplasmicReticulum")<{
    incoming: {
        TransmitParticle: PTransmitParticle;
        OrganelleInfo: POrganelleInfo;
    };
    outgoing: {
        Log: PLog;
        TransmitResponse: PTransmitResponse;
        EuglenaHasBeenBorn: PEuglenaHasBeenBorn;
    };
}>(["TransmitParticle", "OrganelleInfo"], ["EuglenaHasBeenBorn", "Log", "TransmitResponse"]);
