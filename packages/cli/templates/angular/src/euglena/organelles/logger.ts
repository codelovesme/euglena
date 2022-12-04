import { util, particle } from "@euglena/template";
import logger from "@euglena/organelle.logger.console";

const name = "Logger";

export default util.createOrganelleConfig(
    name,
    particle.common.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: logger
        }
    })
);
