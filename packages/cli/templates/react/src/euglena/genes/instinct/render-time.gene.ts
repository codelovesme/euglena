import { cp } from "@euglena/core";
import { cell, env, sys } from "@euglena/template";
import { State } from "../../../state";

import Time = env.time.Time;

export default cell.genetics.dcg<Time, { ui: sys.io.ui.UI }>(
    "When time changed",
    { meta: { class: "Time" } },
    async (p, s, { t }) => {
        const state = cp<State>("State", { title: "Hello Fedai", time: p.data });
        t(cp<sys.io.ui.Render>("Render", state), "ui");
    }
);
