import * as core from "@euglena/core";
import { util, particle } from "@euglena/template";
import ui, { Sap } from "@euglena/organelle.ui.react";
import rootComponent from "../../components/app";

const name = "UI";

export default util.createOrganelleConfig(
    name,
    particle.common.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: ui as any
        }
    }),
    core.particle.cp<Sap>("Sap", { rootComponent: rootComponent, serviceWorker: false }, { organelleName: name })
);
