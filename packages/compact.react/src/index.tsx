import { State, ui } from "@euglena/compact";
import React, { createContext, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { register, unregister } from "./serviceWorker";

export const ToolsContext = createContext({} as { fireEvent: ui.Nucleus["handleEvent"] });

let setState: (state: any) => void;

export class UIReact {
    constructor(rootComponent: React.FC<any>, serviceWorker:boolean, nucleus: ui.Nucleus) {
        (serviceWorker ? register : unregister)();
        const root = createRoot(document.getElementById("root")!);
        const App = () => {
            const [state, _setState] = useState(undefined);
            setState = _setState;
            useEffect(() => {
                console.log('React render completed');
             }, []);
            return rootComponent(state);
        };
        root.render(<ToolsContext.Provider value={{ fireEvent: nucleus.handleEvent }}>{<App />}</ToolsContext.Provider>);
    }
    render (state:State) {
        setState?.(state);
    }
}
