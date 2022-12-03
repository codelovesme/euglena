import { organelle, helpers } from "@euglena/template";
import endoplasmicReticulumJs from "@euglena/organelle.endoplasmic-reticulum.js";

const name = "EndoplasmicReticulum";
export default helpers.organelle.createOrganelleConfig(name, [
    organelle.endoplasmicReticulum.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: endoplasmicReticulumJs
        }
    })
]);
