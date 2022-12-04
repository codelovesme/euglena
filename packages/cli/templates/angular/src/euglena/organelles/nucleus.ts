import * as core from "@euglena/core";
import { particle, util } from "@euglena/template";
import nucleus, { Sap } from "@euglena/organelle.nucleus.js";
import genes from "../genes";

const name = "Nucleus";
export default util.createOrganelleConfig(
    name,
    particle.common.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: nucleus
        }
    }),
    core.particle.cp<Sap>(
        "Sap",
        {
            type: "InMemory",
            genes: genes
        },
        {
            organelleName: name
        }
    )
);
