import { particle } from "@euglena/template";
import reticulum from "@euglena/organelle.reticulum.js";
import { organelles } from "../constants";

export default [
    particle.common.cp("OrganelleInfo", {
        name: organelles.reticulum,
        location: {
            type: "InMemory",
            organelle: reticulum
        }
    })
];
