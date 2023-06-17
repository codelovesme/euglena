import { cp } from "@euglena/core";
import nucleus, { Sap } from "@euglena/organelle.nucleus.js";
import genes from "../genes";

import { organelles } from "../constants";

export default [
    cp("OrganelleInfo", {
        name: organelles.nucleus,
        location: {
            type: "InMemory",
            organelle: nucleus
        }
    }),
    cp<Sap>(
        "Sap",
        {
            type: "InMemory",
            genes: genes
        },
        {
            organelleName: organelles.nucleus
        }
    )
];
