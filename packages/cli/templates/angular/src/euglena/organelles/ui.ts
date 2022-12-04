import * as core from "@euglena/core";
import { util, particle } from "@euglena/template";
import ui, { Sap } from "@euglena/organelle.ui.angular";
import { context } from "../../app/context";
const name = "UI";

export default util.createOrganelleConfig(
    name,
    particle.common.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: ui
        }
    }),
    core.particle.cp<Sap>(
        "Sap",
        {
            context
        },
        { organelleName: name }
    )
);
