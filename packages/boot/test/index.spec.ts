import { ce } from "../src/index";
import reticulum from "@euglena/organelle.endoplasmic-reticulum.js";
import vacuole from "@euglena/organelle.vacuole.js";
import nucleus from "@euglena/organelle.nucleus.js";
import { OrganelleReceive } from "@euglena/organelle";

ce((reticulumReceive: OrganelleReceive) =>
    reticulum.cp.incoming.Sap(
        { name: reticulum.n },
        {
            reticulumReceive: reticulumReceive,
            particles: [
                reticulum.cp.incoming.OrganelleInfo("Nucleus", {
                    type: "NodeModules",
                    path: "@euglena/organelle.nucleus.js"
                }),
                nucleus.cp.incoming.Sap(
                    { name: nucleus.n },
                    {
                        path: __dirname + "/chromosome.js",
                        type: "FileSystemPath"
                    }
                ),
                reticulum.cp.incoming.OrganelleInfo("Vacuole", {
                    type: "NodeModules",
                    path: "@euglena/organelle.vacuole.js"
                }),
                vacuole.cp.incoming.Sap(
                    { name: vacuole.n },
                    {
                        path: __dirname + "/particles.js",
                        type: "FileSystemPath"
                    }
                ),
                reticulum.cp.incoming.OrganelleInfo("Logger", {
                    type: "NodeModules",
                    path: "@euglena/organelle.logger.console"
                })
            ]
        }
    )
);
