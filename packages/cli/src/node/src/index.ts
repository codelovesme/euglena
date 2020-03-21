import { ce, endoplasmicReticulumJs as reticulum, nucleusJs as nucleus } from "@euglena/core";
import vacuole from "@euglena/organelle.vacuole.js";

ce((reticulumReceive) =>
    reticulum.cp.incoming.Sap(
        {
            reticulumReceive: reticulumReceive,
            particles: [
                nucleus.cp.incoming.Sap(
                    {
                        path: __dirname + "/chromosome.js",
                        type: "FileSystemPath"
                    },
                    { organelle: { name: nucleus.n } }
                ),
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
                    { organelle: { name: vacuole.n } }
                ),
                reticulum.cp.incoming.OrganelleInfo({
                    name: "Logger",
                    location: {
                        type: "NodeModules",
                        path: "@euglena/organelle.logger.console"
                    }
                })
            ]
        },
        { organelle: { name: reticulum.n } }
    )
);
