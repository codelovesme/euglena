import * as core from "@euglena/core";
import * as template from "@euglena/template";
import vacuole, { Sap } from "@euglena/organelle.vacuole.js";
import particles from "../particles";

import { organelles } from "../constants";

export default [
    template.particle.common.cp("OrganelleInfo", {
        name: organelles.vacuole,
        location: {
            type: "InMemory",
            organelle: vacuole
        }
    }),
    core.particle.cp<Sap>("Sap", {
        type: "InMemory",
        particles: particles
    })
];
