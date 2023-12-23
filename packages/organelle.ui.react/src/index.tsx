import React, { createContext, useState } from "react";
import { createRoot } from "react-dom/client";
import { register, unregister } from "./serviceWorker";

import { Particle, cp, dco } from "@euglena/core";
import { ACK, cell, sys } from "@euglena/template";

export type Sap = cell.organelle.Sap<{ rootComponent: typeof App; serviceWorker: boolean }>;

let App: React.FC<any>;
export const ToolsContext = createContext({
    t: {} as (particle: Particle<any>) => Promise<Particle | void>,
    cp: {} as ((
        class_: "Log",
        data: {
            message: string;
            level: "Error" | "Info" | "Warning";
        }
    ) => sys.log.Log) &
        ((class_: "Event") => sys.io.ui.Event)
});

let setState: (state: any) => void;

export default dco<sys.io.ui.UI, Sap>({
    Sap: async (p, { t }) => {
        const { rootComponent, serviceWorker } = p.data;
        (serviceWorker ? register : unregister)();
        const root = createRoot(document.getElementById("root")!);
        const App = () => {
            const [state, _setState] = useState(cp("State", undefined));
            setState = _setState;
            return rootComponent(state);
        };
        root.render(<ToolsContext.Provider value={{ t, cp }}>{<App />}</ToolsContext.Provider>);
    },
    Render: async ({ data }) => {
        setState(data);
        return cp<ACK>("ACK");
    }
});
