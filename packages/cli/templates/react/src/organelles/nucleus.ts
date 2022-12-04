import * as core from "@euglena/core";
import { helpers, particle } from "@euglena/template";
import nucleus, { Sap } from "@euglena/organelle.nucleus.js";
import genes from "../genes";

const name = "Nucleus";

export default helpers.organelle.createOrganelleConfig(name, [
    particle.common.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: nucleus as any
        }
    }),
    core.particle.cp<Sap>("Sap", {
        type: "InMemory",
        genes: genes
    },{
        organelleName: name
    })
]);
