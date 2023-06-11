import { organelle } from "@euglena/template";
import logger from "@euglena/organelle.logger.console";

import { organelles } from "../constants";

export default [
    organelle.reticulum.cp("OrganelleInfo", {
        name: organelles.logger,
        location: {
            type: "InMemory",
            organelle: logger
        }
    })
];
