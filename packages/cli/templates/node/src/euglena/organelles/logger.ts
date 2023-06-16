import { cp } from "@euglena/core";
import { cell } from "@euglena/template";
import logger from "@euglena/organelle.logger.console";
import { organelles } from "../constants";


export default [
    cp<cell.organelle.OrganelleInfo>("OrganelleInfo", {
        name: organelles.logger,
        location: {
            type: "InMemory",
            organelle: logger
        }
    })
];
