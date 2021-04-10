import { sys } from "cessnalib";
declare const _default: import("@euglena/core").OrganelleModule<import("@euglena/core").P<any, {
    organelleName: string;
}>, import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        GenerateToken: import("@euglena/core").P<{
            euglenaName: string;
            createdAt: number;
            expireAt: number;
            type: string;
            roles: string[];
            status: "Active" | "Deactive" | "Deleted";
        }, {}>;
        VerifyToken: import("@euglena/core").P<string, {}>;
    };
    outgoing: {
        DecryptedToken: import("@euglena/core").P<{
            euglenaName: string;
            createdAt: number;
            expireAt: number;
            type: string;
            roles: string[];
            status: "Active" | "Deactive" | "Deleted";
        }, {}>;
        EncryptedToken: import("@euglena/core").P<string, {}>;
        Exception: import("@euglena/core").P<sys.type.Exception, {}>;
    };
}, import("@euglena/core").P<any, {
    organelleName: string;
}>>>;
export default _default;
