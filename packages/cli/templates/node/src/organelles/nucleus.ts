import * as core from "@euglena/core";
import { particle, helpers } from "@euglena/template";
import nucleusJs, { Sap } from "@euglena/organelle.nucleus.js";
import genes from "../genes";

const name = "Nucleus";
export default helpers.organelle.createOrganelleConfig(name, [
    particle.common.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: nucleusJs
        }
    }),
    core.particle.cp<Sap>(
        "Sap",
        {
            type: "InMemory",
            genes: genes
        },
        { organelleName: name }
    )
]);
