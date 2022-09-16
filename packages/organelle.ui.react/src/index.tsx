import { Particle, dco, ACK, CreateParticleUnion, Exception, Log, ccp } from "@euglena/core";
import { ui } from "@euglena/template";

import React, { createContext } from "react";
import ReactDOM from "react-dom";
import { register, unregister } from "./serviceWorker";
import { sys } from "cessnalib";

export type Sap = Particle<"Sap", { rootComponent: typeof App; serviceWorker: boolean }>;

let App: React.FC<any>;
export const ToolsContext = createContext({
    t: {} as (particle: Coc | Doc) => Promise<CocResponse><
        | Particle<"ACK", undefined, {}>
        | Particle<"Exception", sys.type.Exception, {}>
        | Particle<
              "Log",
              {
                  message: string;
                  level: "Error" | "Info" | "Warning";
              },
              {}
          >
        | Particle<"Event">,
        void | Particle
    >,
    cp: {} as CreateParticleUnion<ACK | Exception | Log | ui.Event>;
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
        return ccp.ACK();
    }
});
