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
            status: string;
        }, {}>;
        VerifyToken: import("@euglena/core").P<string, {}>;
    };
    outgoing: {
        Token: import("@euglena/core").P<{
            crypted: string;
            decrypted: {
                euglenaName: string;
                createdAt: number;
                expireAt: number;
                type: string;
                roles: string[];
                status: string;
            };
        }, {}>;
        Exception: import("@euglena/core").P<sys.type.Exception, {}>;
        ACK: import("@euglena/core").P<undefined, {}>;
    };
}, import("@euglena/core").P<any, {
    organelleName: string;
}>>>;
export default _default;
