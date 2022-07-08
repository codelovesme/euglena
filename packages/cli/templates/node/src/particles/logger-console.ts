import { endoplasmicReticulum } from "@euglena/template";
import logger from "@euglena/organelle.logger.console";

export const name = "LoggerConsole";
export const particles = [
  endoplasmicReticulum.cp.OrganelleInfo({
    name: name,
    location: {
      type: "InMemory",
      organelle: logger,
    },
  }),
];