import { sys } from "cessnalib";
import { cp } from "@euglena/core";
import { cell } from "@euglena/template";
import timer, { Sap } from "@euglena/organelle.timer.js";
import { organelles } from "../constants";

const now: sys.Time = sys.StaticTools.Time.fromJavascriptDate(new Date());

export default [
    cp<cell.organelle.OrganelleInfo>("OrganelleInfo", {
        name: organelles.timer,
        location: {
            type: "InMemory",
            organelle: timer
        }
    }),
    cp<Sap>("Sap", now, { organelleName: organelles.timer })
];
