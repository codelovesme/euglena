import { sys } from "cessnalib";
import timer, { Sap } from "@euglena/organelle.timer.js";
import { organelles } from "../constants";
import { cp } from "@euglena/core";

const now: sys.Time = sys.StaticTools.Time.fromJavascriptDate(new Date());

export default [
    cp("OrganelleInfo", {
        name: organelles.timer,
        location: {
            type: "InMemory",
            organelle: timer
        }
    }),
    cp<Sap>("Sap", now, { organelleName: organelles.timer })
];
