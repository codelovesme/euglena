import * as core from "@euglena/core";
import { particle } from "@euglena/template";
import ui, { Sap } from "@euglena/organelle.ui.react";
import rootComponent from "../../components/app";
import { organelles } from "../constants";

export default [
    particle.common.cp("OrganelleInfo", {
        name: organelles.ui,
        location: {
            type: "InMemory",
            organelle: ui as any
        }
    }),
    core.particle.cp<Sap>(
        "Sap",
        { rootComponent: rootComponent, serviceWorker: false },
        { organelleName: organelles.ui }
    )
];
