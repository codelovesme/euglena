import * as core from "@euglena/core";
import { particle } from "@euglena/template";
import ui, { Sap } from "@euglena/organelle.ui.angular";
import { context } from "../../app/context";
import { organelles } from "../constants";

export default [
    particle.common.cp("OrganelleInfo", {
        name: organelles.ui,
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
        { organelleName: organelles.ui }
    )
];
