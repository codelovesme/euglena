import * as core from "@euglena/core";
import { particle } from "@euglena/template";
import vacuole from "@euglena/organelle.vacuole.js";
import particles from "../particles";
import { organelles } from "../constants";

export default [
    particle.common.cp("OrganelleInfo", {
        name: organelles.vacuoleJs,
        location: {
            type: "InMemory",
            organelle: vacuole
        }
    }),
    core.particle.cp("Sap", {
        type: "InMemory",
        particles: particles
    })
];
