import { organelle, util } from "@euglena/template";
import endoplasmicReticulum from "@euglena/organelle.endoplasmic-reticulum.js";

const name = "EndoplasmicReticulum";
export default util.createOrganelleConfig(
    name,
    organelle.endoplasmicReticulum.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: endoplasmicReticulum
        }
    })
);
