import { cc, logger, Particle, ui } from "@euglena/core";
import { loggerConsoleName, uiAngular } from "../constants";
import { State } from "../state";
import { sys } from "cessnalib";

type Time = particle.Particle<"Time", sys.type.Time>;

const now: sys.type.Time = sys.type.StaticTools.Time.fromJavascriptDate(new Date());

export default cc((g) => {
    g("When time changed", { meta: { class: "Time" } }, async (p: Time, s, { t }) => {
        const state: State = { title: "Hello Fedai", time: p.data };
        t(ui.v1.cp.Render(state), uiAngular);
    });
});
