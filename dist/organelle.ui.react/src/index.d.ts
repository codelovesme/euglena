import React from "react";
import { Particle } from "@euglena/core";
import { cell, sys } from "@euglena/template";
export type Sap = cell.organelle.Sap<{
    rootComponent: typeof App;
    serviceWorker: boolean;
}>;
declare let App: React.FC<any>;
export declare const ToolsContext: React.Context<{
    t: (particle: Particle<any>) => Promise<Particle | void>;
    cp: ((class_: "Log", data: {
        message: string;
        level: "Error" | "Info" | "Warning";
    }) => sys.log.Log) & ((class_: "Event") => sys.io.ui.Event);
}>;
declare const _default: import("@euglena/core").CreateOrganelle<import("@euglena/core").OrganelleInteractions>;
export default _default;
//# sourceMappingURL=index.d.ts.map