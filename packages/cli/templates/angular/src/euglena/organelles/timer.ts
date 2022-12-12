import * as core from "@euglena/core";
import { particle } from "@euglena/template";
import timer, { Sap } from "@euglena/organelle.timer.js";
import { sys } from "cessnalib";
import { organelles } from "../constants";

const now: sys.type.Time = sys.type.StaticTools.Time.fromJavascriptDate(new Date());

export default [
    particle.common.cp("OrganelleInfo", {
        name: organelles.timer,
        location: {
            type: "InMemory",
            organelle: timer
        }
    }),
    core.particle.cp<Sap>("Sap", now, { organelleName: organelles.timer })
];
