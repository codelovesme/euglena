import { AllInteractions, CreateOrganelle, Log, Particle } from "@euglena/core";

export type TransmitParticle = Particle<"TransmitParticle", { target: string; particle: Particle }>;
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
export type TransmitResponse = Particle<"TransmitResponse", Particle | void>;
export type EuglenaHasBeenBorn = Particle<"EuglenaHasBeenBorn">;

export type EndoplasmicReticulum = AllInteractions<{
    in: [[TransmitParticle, TransmitResponse], OrganelleInfo];
    out: [Log, EuglenaHasBeenBorn];
}>;
