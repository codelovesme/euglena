import { cp } from "@euglena/core";
import { particle } from "@euglena/template";
import nucleusJs, { Sap } from "@euglena/organelle.nucleus.js";
import genes from "./genes";

export const name = "Nucleus";
export const particles = [
    particle.common.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: nucleusJs
        }
    }),
    cp<Sap>(
        "Sap",
        {
            type: "InMemory",
            genes: genes
        },
        { organelleName: name }
    )
];
