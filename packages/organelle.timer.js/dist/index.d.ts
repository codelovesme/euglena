import { sys } from "cessnalib";
declare const _default: import("@euglena/core").OrganelleModule<"Timer", import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        ReadTime: import("@euglena/core").P<any, {}>;
        SetTime: import("@euglena/core").P<sys.type.Time, {}>;
    };
    outgoing: {
        ACK: import("@euglena/core").P<undefined, {}>;
        Time: import("@euglena/core").P<sys.type.Time, {}>;
    };
}, import("@euglena/core").P<sys.type.Time, {
    organelle: {
        name: string;
        nick?: string | undefined;
    };
}>>>;
export default _default;
