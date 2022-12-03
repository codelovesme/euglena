import * as core from "@euglena/core";
import * as template from "@euglena/template";
import vacuole from "@euglena/organelle.vacuole.js";
import vacuoleJsParticles from "../particles";

const name = "Vacuole";
export default template.helpers.organelle.createOrganelleConfig(name, [
    template.particle.common.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: vacuole
        }
    }),
    core.particle.cp("Sap", {
        type: "InMemory",
        particles: vacuoleJsParticles
    })
]);
