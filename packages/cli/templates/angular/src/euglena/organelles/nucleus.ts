import nucleus, { Sap } from "@euglena/organelle.nucleus.js";
import genes from "../genes";
import { organelles } from "../constants";
import { cp } from "@euglena/core";
import { cell } from "@euglena/template";

export default [
  cp<cell.organelle.OrganelleInfo>("OrganelleInfo", {
    name: organelles.nucleus,
    location: {
      type: "InMemory",
      organelle: nucleus,
    },
  }),
  cp<Sap>(
    "Sap",
    {
      type: "InMemory",
      genes: genes,
    },
    { organelleName: organelles.nucleus }
  ),
];
