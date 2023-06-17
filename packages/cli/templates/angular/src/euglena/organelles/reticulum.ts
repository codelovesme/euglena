import { cp } from "@euglena/core";
import reticulum from "@euglena/organelle.reticulum.js";
import { organelles } from "../constants";

export default [
  cp("OrganelleInfo", {
    name: organelles.reticulum,
    location: {
      type: "InMemory",
      organelle: reticulum,
    },
  }),
];
