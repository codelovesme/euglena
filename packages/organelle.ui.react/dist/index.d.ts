import { Particle, CreateOrganelleParticles, P } from "@euglena/core";
import React from "react";
import { OrganelleTransmit } from "@euglena/core/dist/organelle/organelle-receive.h";
import { sys } from "cessnalib";
export declare const ToolsContext: React.Context<{
    t: OrganelleTransmit<Particle<"ACK", undefined, {}> | Particle<"Exception", sys.type.Exception, {}> | Particle<"Log", {
        message: string;
        level: "Error" | "Info" | "Warning";
    }, {}> | Particle<"Event", any, {
        [x: string]: any;
    }>, void | Particle<string, any, {
        [x: string]: any;
    }>>;
    cp: CreateOrganelleParticles<{
        ACK: P<undefined, {}>;
        Exception: P<sys.type.Exception, {}>;
        Log: P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
        Event: P<any, {}>;
    }>;
}>;
declare const _default: import("@euglena/core").OrganelleModule<P<{
    rootComponent: React.FC<any>;
    serviceWorker: boolean;
}, {
    organelleName: string;
}>, import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        Render: P<any, {}>;
    };
    outgoing: {
        ACK: P<undefined, {}>;
        Exception: P<sys.type.Exception, {}>;
        Log: P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
        Event: P<any, {}>;
    };
}, P<{
    rootComponent: React.FC<any>;
    serviceWorker: boolean;
}, {
    organelleName: string;
}>>>;
export default _default;
