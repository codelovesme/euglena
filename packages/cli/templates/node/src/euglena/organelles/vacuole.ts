import * as core from "@euglena/core";
import * as template from "@euglena/template";
import vacuole, { Sap } from "@euglena/organelle.vacuole.js";
import particles from "../particles";

const name = "Vacuole";
export default template.util.createOrganelleConfig(
    name,
    template.particle.common.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: vacuole
        }
    }),
    core.particle.cp<Sap>("Sap", {
        type: "InMemory",
        particles: particles
    })
);
