declare const _default: import("@euglena/core").OrganelleModule<import("@euglena/core").P<any, {
    organelleName: string;
}>, import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        WriteFile: import("@euglena/core").P<{
            filePath: string;
            content: string;
            encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined;
        }, {}>;
        ReadFile: import("@euglena/core").P<{
            filePath: string;
            encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined;
        }, {}>;
    };
    outgoing: {
        Log: import("@euglena/core").P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
        Exception: import("@euglena/core").P<import("cessnalib").sys.type.Exception, {}>;
        ACK: import("@euglena/core").P<undefined, {}>;
        FileContent: import("@euglena/core").P<string, {}>;
    };
}, import("@euglena/core").P<any, {
    organelleName: string;
}>>>;
export default _default;
