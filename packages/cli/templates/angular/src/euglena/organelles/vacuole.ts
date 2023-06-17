import { cp } from "@euglena/core";
import { cell } from "@euglena/template";
import vacuole from "@euglena/organelle.vacuole.js";
import particles from "../particles";
import { organelles } from "../constants";

export default [
    cp<cell.organelle.OrganelleInfo>("OrganelleInfo", {
        name: organelles.vacuoleJs,
        location: {
            type: "InMemory",
            organelle: vacuole
        }
    }),
    cp("Sap", {
        type: "InMemory",
        particles: particles
    })
];
