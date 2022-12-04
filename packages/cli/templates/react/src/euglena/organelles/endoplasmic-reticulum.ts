import { util, particle } from "@euglena/template";
import reticulum from "@euglena/organelle.endoplasmic-reticulum.js";

const name = "EndoplasmicReticulum";

export default util.createOrganelleConfig(
    name,
    particle.common.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: reticulum as any
        }
    })
);
