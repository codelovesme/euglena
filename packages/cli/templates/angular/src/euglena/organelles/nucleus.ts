import * as core from "@euglena/core";
import nucleus, { Sap } from "@euglena/organelle.nucleus.js";
import { particle } from "@euglena/template";
import genes from "../genes";
import { organelles } from "../constants";

export default [
  particle.common.cp("OrganelleInfo", {
    name: organelles.nucleus,
    location: {
      type: "InMemory",
      organelle: nucleus,
    },
  }),
  core.particle.cp<Sap>(
    "Sap",
    {
      type: "InMemory",
      genes: genes,
    },
    { organelleName: organelles.nucleus }
  ),
];
