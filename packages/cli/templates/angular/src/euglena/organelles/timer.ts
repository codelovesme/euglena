import * as core from "@euglena/core";
import { helpers, particle } from "@euglena/template";
import timer, { Sap } from "@euglena/organelle.timer.js";
import { sys } from "cessnalib";

const name = "Timer";
const now: sys.type.Time = sys.type.StaticTools.Time.fromJavascriptDate(new Date());

export default helpers.organelle.createOrganelleConfig(name, [
    particle.common.cp("OrganelleInfo", {
        name: name,
        location: {
            type: "InMemory",
            organelle: timer as any
        }
    }),
    core.particle.cp<Sap>("Sap", now, { organelleName: name })
]);
