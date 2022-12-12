import { organelle } from "@euglena/template";
import endoplasmicReticulum from "@euglena/organelle.endoplasmic-reticulum.js";

import { organelles } from "../constants";

export default [
    organelle.endoplasmicReticulum.cp("OrganelleInfo", {
        name: organelles.endoplasmicReticulum,
        location: {
            type: "InMemory",
            organelle: endoplasmicReticulum
        }
    })
];
