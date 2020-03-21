import React from "react";
export declare const ToolsContext: React.Context<{
    t: any;
    cp: any;
}>;
declare const _default: import("@euglena/core").OrganelleModule<"UI", import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        Render: import("@euglena/core").P<any, {}>;
    };
    outgoing: {
        ACK: import("@euglena/core").P<undefined, {}>;
        Exception: import("@euglena/core").P<import("cessnalib").sys.type.Exception, {}>;
        Log: import("@euglena/core").P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
        Event: import("@euglena/core").P<any, {}>;
    };
}, import("@euglena/core").P<{
    rootComponent: React.FunctionComponent<any>;
    serviceWorker: boolean;
}, {
    organelle: {
        name: string;
        nick?: string | undefined;
    };
}>>>;
export default _default;
