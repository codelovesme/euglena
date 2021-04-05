declare const _default: import("@euglena/core").OrganelleModule<import("@euglena/core").P<{
    saltRounds: string;
}, {
    organelleName: string;
}>, import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        Hash: import("@euglena/core").P<string, {}>;
        Compare: import("@euglena/core").P<{
            plainPassword: string;
            hashedPassword: string;
        }, {}>;
    };
    outgoing: {
        HashedPassword: import("@euglena/core").P<string, {}>;
        Exception: import("@euglena/core").P<import("cessnalib").sys.type.Exception, {}>;
        ACK: import("@euglena/core").P<undefined, {}>;
        CompareResult: import("@euglena/core").P<boolean, {}>;
    };
}, import("@euglena/core").P<{
    saltRounds: string;
}, {
    organelleName: string;
}>>>;
export default _default;
