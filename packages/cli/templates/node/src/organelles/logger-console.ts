import { organelle } from "@euglena/template";
import logger from "@euglena/organelle.logger.console";

export const name = "LoggerConsole";
export const particles = [
    organelle.endoplasmicReticulum.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: logger
        }
    })
];
