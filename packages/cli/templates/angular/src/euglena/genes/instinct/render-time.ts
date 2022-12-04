import * as core from "@euglena/core";
import * as template from "@euglena/template";
import { dcg } from "@euglena/organelle.nucleus.js";
import { State } from "../../../state";

import Time = template.organelle.timer.Time;

export default dcg<Time, { ui: template.organelle.ui.UI }>(
    "When time changed",
    { meta: { class: "Time" } },
    async (p, s, { t }) => {
        const state = core.particle.cp<State>("State", { title: "Hello Fedai", time: p.data });
        t(core.particle.cp<template.organelle.ui.Render>("Render", state), "ui");
    }
);
