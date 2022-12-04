import { organelle, util } from "@euglena/template";
import logger from "@euglena/organelle.logger.console";

const name = "Logger";
export default util.createOrganelleConfig(
    name,
    organelle.endoplasmicReticulum.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: logger
        }
    })
);
