import { cp } from "@euglena/core";
import ui, { Sap } from "@euglena/organelle.ui.react";
import rootComponent from "../../components/app";
import { organelles } from "../constants";

export default [
    cp("OrganelleInfo", {
        name: organelles.ui,
        location: {
            type: "InMemory",
            organelle: ui
        }
    }),
    cp<Sap>(
        "Sap",
        { rootComponent: rootComponent, serviceWorker: false },
        { organelleName: organelles.ui }
    )
];
