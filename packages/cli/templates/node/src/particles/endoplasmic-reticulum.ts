import { endoplasmicReticulum } from "@euglena/template";
import logger from "@euglena/organelle.logger.consol";
import { cp } from "@euglena/core";

export const name = "EndoplasmicReticulum";
export const particles = [
  cp<endoplasmicReticulum.OrganelleInfo>("OrganelleInfo",{
    name: name,
    location: {
      type: "InMemory",
      organelle: logger,
    },
  }),
];