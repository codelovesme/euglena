import { Particle, cp } from "@euglena/core";
import { endoplasmicReticulum as reticulum, nucleusJs as nucleus } from "@euglena/core";
import vacuoleJs from "@euglena/organelle.vacuole.js";

export const LoggerName: string = "Logger";

export default [
    cp("EuglenaName", "must_be_replaced"),
    reticulum.cp.incoming.OrganelleInfo({
        name: "Vacuole",
        location: {
            type: "NodeModules",
            path: "@euglena/organelle.vacuole.js"
        }
    }),
    reticulum.cp.incoming.OrganelleInfo({
        name: LoggerName,
        location: {
            type: "NodeModules",
            path: "@euglena/organelle.logger.console"
        }
    }),
    nucleus.cp.incoming.Sap({
        path: __dirname + "/chromosome.js",
        type: "FileSystemPath"
    }),
    vacuoleJs.cp.incoming.Sap(
        {
            path: __dirname + "/particles.js",
            type: "FileSystemPath"
        },
        { organelleName: "Vacuole" }
    )
] as Particle[];
