import * as core from "@euglena/core";
import { organelle, particle } from "@euglena/template";

import ui = organelle.ui;
import common = particle.common;
import ACK = common.ACK;
import Log = common.Log;
import Particle = core.particle.Particle;
import CreateParticleUnion = core.particle.CreateParticleUnion;

const dco = core.organelle.dco;

import React, { createContext } from "react";
import ReactDOM from "react-dom";
import { register, unregister } from "./serviceWorker";

export type Sap = Particle<"Sap", { rootComponent: typeof App; serviceWorker: boolean }>;

let App: React.FC<any>;
export const ToolsContext = createContext({
    t: {} as (particle: Particle<any>) => Promise<Particle | void>,
    cp: {} as CreateParticleUnion<ACK | Log | ui.Event>
});

export default dco<ui.UI, Sap>({
    Sap: async (p) => {
        const { rootComponent, serviceWorker } = p.data;
        App = rootComponent;
        (serviceWorker ? register : unregister)();
    },
    Render: async ({ data: props }, { t, cp }) => {
        ReactDOM.render(
            <ToolsContext.Provider value={{ t, cp }}>{App(props)}</ToolsContext.Provider>,
            document.getElementById("root")
        );
        return common.cp("ACK");
    }
});
