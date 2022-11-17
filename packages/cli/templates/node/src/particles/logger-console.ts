import { endoplasmicReticulum } from "@euglena/template";
import logger from "@euglena/organelle.logger.console";
import { cp } from "@euglena/core";

export const name = "LoggerConsole";
export const particles = [
  cp<endoplasmicReticulum.OrganelleInfo>("OrganelleInfo",{
    name: name,
    location: {
      type: "InMemory",
      organelle: logger,
    },
  }),
];