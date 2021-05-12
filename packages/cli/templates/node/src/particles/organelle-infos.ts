import { endoplasmicReticulum as reticulum } from "@euglena/core";
import { LoggerName } from "../constants";

export default [
    reticulum.cp.OrganelleInfo({
        name: "Vacuole",
        location: {
            type: "NodeModules",
            path: "@euglena/organelle.vacuole.js"
        }
    }),
    reticulum.cp.OrganelleInfo({
        name: LoggerName,
        location: {
            type: "NodeModules",
            path: "@euglena/organelle.logger.console"
        }
    })
];
