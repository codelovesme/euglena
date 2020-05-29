import { Particle, cp } from "@euglena/core";
import { endoplasmicReticulumJs as reticulum, nucleusJs as nucleus } from "@euglena/core";
import vacuole from "@euglena/organelle.vacuole.js";

export default [
    cp("EuglenaName", "must_be_replaced"),
    nucleus.cp.incoming.Sap({
        path: __dirname + "/chromosome.js",
        type: "FileSystemPath"
    }),
    reticulum.cp.incoming.OrganelleInfo({
        name: "Vacuole",
        location: {
            type: "NodeModules",
            path: "@euglena/organelle.vacuole.js"
        }
    }),
    vacuole.cp.incoming.Sap(
        {
            path: __dirname + "/particles.js",
            type: "FileSystemPath"
        },
        { organelleName: "Vacuole" }
    ),
    reticulum.cp.incoming.OrganelleInfo({
        name: "Logger",
        location: {
            type: "NodeModules",
            path: "@euglena/organelle.logger.console"
        }
    })
] as Particle[];
