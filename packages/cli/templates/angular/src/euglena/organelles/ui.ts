import ui, { Sap } from "@euglena/organelle.ui.angular";
import { context } from "../../app/context";
import { organelles } from "../constants";
import { cp } from "@euglena/core";
import { cell } from "@euglena/template";

export default [
    cp<cell.organelle.OrganelleInfo>("OrganelleInfo", {
        name: organelles.ui,
        location: {
            type: "InMemory",
            organelle: ui
        }
    }),
    cp<Sap>(
        "Sap",
        {
            context
        },
        { organelleName: organelles.ui }
    )
];
