import { cp } from "@euglena/core";
import { OrganelleInfo } from "@euglena/template";
import vacuole, { Sap } from "@euglena/organelle.vacuole.js";
import vacuoleJsParticles from "./particles";

export const name = "VacuoleJs";
export const particles = [
    cp<OrganelleInfo>("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: vacuole
        }
    }),
    cp<Sap>({
        type: "InMemory",
        particles: vacuoleJsParticles
    })
];
