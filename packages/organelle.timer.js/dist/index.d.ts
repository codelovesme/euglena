import { sys } from "cessnalib";
declare const _default: import("@euglena/organelle").OrganelleModule<"Timer", import("@euglena/organelle").InsertSapIntoParticles<{
    incoming: {
        ReadTime: (adds?: import("@euglena/particle").MetaAdditions | undefined) => import("@euglena/particle").Particle<"ReadTime", undefined, import("@euglena/particle").MetaAdditions>;
        SetTime: (time: sys.type.Time, adds?: import("@euglena/particle").MetaAdditions | undefined) => import("@euglena/particle").Particle<"SetTime", sys.type.Time, import("@euglena/particle").MetaAdditions>;
    };
    outgoing: {
        Time: (time: sys.type.Time, adds?: import("@euglena/particle").MetaAdditions | undefined) => import("@euglena/particle").Particle<"Time", sys.type.Time, import("@euglena/particle").MetaAdditions>;
        ACK: (adds?: import("@euglena/particle").MetaAdditions | undefined) => import("@euglena/particle").Particle<"ACK", undefined, import("@euglena/particle").MetaAdditions>;
    };
}, sys.type.Time>>;
export default _default;
