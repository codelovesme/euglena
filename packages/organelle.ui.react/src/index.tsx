import React, { createContext, useState } from "react";
import { createRoot } from "react-dom/client";
import { register, unregister } from "./serviceWorker";
import * as core from "@euglena/core";
import { organelle, particle } from "@euglena/template";

import ui = organelle.ui;
import common = particle.common;
import Particle = core.particle.Particle;

export type Sap = particle.common.Sap<{ rootComponent: typeof App; serviceWorker: boolean }>;

let App: React.FC<any>;
export const ToolsContext = createContext({
    t: {} as (particle: Particle<any>) => Promise<Particle | void>,
    cp: {} as ((
        class_: "Log",
        data: {
            message: string;
            level: "Error" | "Info" | "Warning";
        }
    ) => particle.common.Log) &
        ((class_: "Event") => organelle.ui.Event)
});

let setState: (state: any) => void;

export default core.organelle.dco<ui.UI, Sap>({
    Sap: async (p, { t, cp }) => {
        const { rootComponent, serviceWorker } = p.data;
        (serviceWorker ? register : unregister)();
        const root = createRoot(document.getElementById("root")!);
        const App = () => {
            const [state, _setState] = useState(core.particle.cp("State", undefined));
            setState = _setState;
            return rootComponent(state);
        };
        root.render(<ToolsContext.Provider value={{ t, cp }}>{<App />}</ToolsContext.Provider>);
    },
    Render: async ({ data }) => {
        setState(data);
        return common.cp("ACK");
    }
});
