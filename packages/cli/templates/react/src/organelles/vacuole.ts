import * as core from "@euglena/core";
import { util, particle } from "@euglena/template";
import vacuole, { Sap } from "@euglena/organelle.vacuole.js";
import particles from "../particles";

const name = "Vacuole";

export default util.createOrganelleConfig(
    name,
    particle.common.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: vacuole as any
        }
    }),
    core.particle.cp<Sap>("Sap", {
        type: "InMemory",
        particles: particles
    })
);
