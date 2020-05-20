import React from "react";
export declare const ToolsContext: React.Context<{
    t: any;
    cp: any;
}>;
declare const _default: import("@euglena/core").OrganelleModule<import("@euglena/core").InsertSapIntoParticles<{
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
    rootComponent: React.FC<any>;
    serviceWorker: boolean;
}, {
    organelleName: string;
}>>>;
export default _default;
