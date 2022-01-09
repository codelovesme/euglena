import { ui, Sap, Particle, CreateOrganelleParticles, P } from "@euglena/core";

import React, { createContext } from "react";
import ReactDOM from "react-dom";
import { register, unregister } from "./serviceWorker";
import { sys } from "cessnalib";
import { OrganelleTransmit } from "@euglena/core/dist/organelle/organelle-receive.h";

let App: React.FC<any>;
export const ToolsContext = createContext({
    t: {} as OrganelleTransmit<
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
    cp: {} as CreateOrganelleParticles<{
        ACK: P<undefined, {}>;
        Exception: P<sys.type.Exception, {}>;
        Log: P<
            {
                message: string;
                level: "Error" | "Info" | "Warning";
            },
            {}
        >;
        Event: P<any, {}>;
    }>
});

export default ui.v1.com<Sap<{ rootComponent: typeof App; serviceWorker: boolean }>>({
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
        return cp.ACK();
    }
});
