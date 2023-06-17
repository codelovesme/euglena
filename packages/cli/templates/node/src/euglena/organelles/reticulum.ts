import { cp } from "@euglena/core";
import { cell } from "@euglena/template";
import reticulum from "@euglena/organelle.reticulum.js";
import { organelles } from "../constants";

export default [
    cp<cell.organelle.OrganelleInfo>("OrganelleInfo", {
        name: organelles.reticulum,
        location: {
            type: "InMemory",
            organelle: reticulum
        }
    })
];
