import { ui, Sap } from "@euglena/core";

import React, { createContext } from "react";
import ReactDOM from "react-dom";
import { register, unregister } from "./serviceWorker";

let App: React.FC<any>;
export const ToolsContext = createContext({ t: {} as any, cp: {} as any });

export default ui.v1.com<Sap<{ rootComponent: typeof App; serviceWorker: boolean }>>({
    Sap: async (p) => {
        const { rootComponent, serviceWorker } = p.data;
        App = rootComponent;
        (serviceWorker ? register : unregister)();
    },
    Render: async ({ data: props }, { t, cp }) => {
        ReactDOM.render(
            <ToolsContext.Provider value={{ t, cp }}>
                <App {...(props as any)} />
            </ToolsContext.Provider>,
            document.getElementById("root")
        );
        return cp.ACK();
    }
});
