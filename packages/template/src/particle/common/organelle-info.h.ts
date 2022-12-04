import { organelle, particle } from "@euglena/core";

export type OrganelleInfo = particle.Particle<
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
                  organelle: organelle.CreateOrganelle;
              };
    }
>;