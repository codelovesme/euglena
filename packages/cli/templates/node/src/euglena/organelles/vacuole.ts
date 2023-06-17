import { cp } from "@euglena/core";
import { cell } from "@euglena/template";
import vacuole, { Sap } from "@euglena/organelle.vacuole.js";
import particles from "../particles";
import { organelles } from "../constants";

export default [
    cp<cell.organelle.OrganelleInfo>("OrganelleInfo", {
        name: organelles.vacuole,
        location: {
            type: "InMemory",
            organelle: vacuole
        }
    }),
    cp<Sap>("Sap", {
        type: "InMemory",
        particles: particles
    })
];
