import { organelle, helpers } from "@euglena/template";
import logger from "@euglena/organelle.logger.console";

const name = "Logger";
export default helpers.organelle.createOrganelleConfig(name,[
    organelle.endoplasmicReticulum.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: logger
        }
    })
]);
