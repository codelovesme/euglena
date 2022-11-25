import { organelle } from "@euglena/template";
import endoplasmicReticulumJs from "@euglena/organelle.endoplasmic-reticulum.js";

export const name = "EndoplasmicReticulum";
export const particles = [
  organelle.endoplasmicReticulum.cp("OrganelleInfo", {
    name: name,
    location: {
      type: "InMemory",
      organelle: endoplasmicReticulumJs,
    },
  }),
];
