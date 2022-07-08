import { endoplasmicReticulum } from "@euglena/template";
import vacuole from "@euglena/organelle.vacuole.js";
import vacuoleJsParticles from "./particles";

export const name = "VacuoleJs";
export const particles = [
  endoplasmicReticulum.cp.OrganelleInfo({
    name: name,
    location: {
      type: "InMemory",
      organelle: vacuole,
    },
  }),
  vacuole.cs(
    {
      type: "InMemory",
      particles: vacuoleJsParticles,
    },
    { organelleName: name }
  ),
];
