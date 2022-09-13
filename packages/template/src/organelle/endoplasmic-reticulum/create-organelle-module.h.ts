import { AllInteractions, CreateOrganelle, Log, Particle } from "@euglena/core";

export type Namespace = "EndoplasmicReticulum";

export type TransmitParticle = Particle<
    "TransmitParticle",
    { target: string; particle: Particle },
    { namespace: Namespace }
>;
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
    },
    { namespace: Namespace }
>;
export type TransmitResponse = Particle<"TransmitResponse", Particle | void, { namespace: Namespace }>;
export type EuglenaHasBeenBorn = Particle<"EuglenaHasBeenBorn", { namespace: Namespace }>;

export type EndoplasmicReticulum = AllInteractions<{
    in: [[TransmitParticle, TransmitResponse], OrganelleInfo];
    out: [Log, EuglenaHasBeenBorn];
}>;
