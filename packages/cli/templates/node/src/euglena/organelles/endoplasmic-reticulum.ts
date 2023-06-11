import { organelle } from "@euglena/template";
import reticulum from "@euglena/organelle.reticulum.js";

import { organelles } from "../constants";

export default [
    organelle.reticulum.cp("OrganelleInfo", {
        name: organelles.reticulum,
        location: {
            type: "InMemory",
            organelle: reticulum
        }
    })
];
