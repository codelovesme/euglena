import { particle } from "@euglena/template";
import endoplasmicReticulum from "@euglena/organelle.endoplasmic-reticulum.js";
import { organelles } from "../constants";

export default [
  particle.common.cp("OrganelleInfo", {
    name: organelles.endoplasmicReticulum,
    location: {
      type: "InMemory",
      organelle: endoplasmicReticulum,
    },
  }),
];
