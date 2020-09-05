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
            queryParams: string[];
            pathParams: string[];
        }, {}>;
    };
    outgoing: {
        ACK: import("@euglena/core").P<undefined, {}>;
        Exception: import("@euglena/core").P<import("cessnalib").sys.type.Exception, {}>;
        Impulse: import("@euglena/core").P<{
            route: string;
            path: string;
            method: string;
            queryParams: object;
            pathParams: object;
            user?: {
                id: string;
                roles: string;
            } | undefined;
            body: object;
        }, {}>;
        Log: import("@euglena/core").P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
    };
}, import("@euglena/core").P<{
    port: number;
}, {
    organelleName: string;
}>>>;
export default _default;
