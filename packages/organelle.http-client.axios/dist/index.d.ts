declare const _default: import("@euglena/core").OrganelleModule<import("@euglena/core").P<undefined, {
    organelleName: string;
}>, import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        Get: import("@euglena/core").P<{
            url: string;
            headers?: import("@euglena/core/dist/template/organelle/utils").Headers | undefined;
        }, {}>;
        Post: import("@euglena/core").P<{
            url: string;
            headers?: import("@euglena/core/dist/template/organelle/utils").Headers | undefined;
            body: any;
        }, {}>;
        Put: import("@euglena/core").P<{
            url: string;
            headers?: import("@euglena/core/dist/template/organelle/utils").Headers | undefined;
            body: any;
        }, {}>;
        Delete: import("@euglena/core").P<{
            url: string;
            headers?: import("@euglena/core/dist/template/organelle/utils").Headers | undefined;
        }, {}>;
    };
    outgoing: {
        ACK: import("@euglena/core").P<undefined, {}>;
        Exception: import("@euglena/core").P<import("cessnalib").sys.type.Exception, {}>;
        Log: import("@euglena/core").P<{
            message: string;
            level: "Warning" | "Error" | "Info";
        }, {}>;
        Response: import("@euglena/core").P<{
            headers?: import("@euglena/core/dist/template/organelle/utils").Headers | undefined;
            body: any;
            status: number;
        }, {}>;
    };
}, import("@euglena/core").P<undefined, {
    organelleName: string;
}>>>;
export default _default;
