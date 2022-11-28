import { cp } from "@euglena/core";
import { particle } from "@euglena/template";
import vacuole, { Sap } from "@euglena/organelle.vacuole.js";
import vacuoleJsParticles from "./particles";

export const name = "VacuoleJs";
export const particles = [
    particle.common.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: vacuole
        }
    }),
    cp<Sap>("Sap", {
        type: "InMemory",
        particles: vacuoleJsParticles
    })
];
