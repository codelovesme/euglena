declare const _default: import("@euglena/core").OrganelleModule<import("@euglena/core").P<{
    port: number;
}, {
    organelleName: string;
}>, import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        GetAlive: import("@euglena/core").P<undefined, {}>;
        AddRoute: import("@euglena/core").P<{
            method: "get" | "post" | "put" | "delete";
            path: string;
            queryParams?: string[] | undefined;
        }, {}>;
    };
    outgoing: {
        ACK: import("@euglena/core").P<undefined, {}>;
        Exception: import("@euglena/core").P<import("cessnalib").sys.type.Exception, {}>;
        WebServerImpulse: import("@euglena/core").P<{
            path: string;
            method: string;
            queryParams: object;
            pathParams: object;
            headers?: import("@euglena/core/dist/template/organelle/utils").Headers | undefined;
            body: object;
        }, {}>;
        Log: import("@euglena/core").P<{
            message: string;
            level: "Warning" | "Error" | "Info";
        }, {}>;
    };
}, import("@euglena/core").P<{
    port: number;
}, {
    organelleName: string;
}>>>;
export default _default;
