import { MetaAdditions } from "@euglena/particle";
import { sys } from "cessnalib";
declare const _default: import("@euglena/organelle").CreateOrganelleModuleInterface<"Timer", {
    incoming: {
        ReadTime: (adds?: MetaAdditions | undefined) => import("@euglena/particle").Particle<"ReadTime", undefined, MetaAdditions>;
        SetTime: (time: sys.type.Time, adds?: MetaAdditions | undefined) => import("@euglena/particle").Particle<"SetTime", sys.type.Time, MetaAdditions>;
    };
    outgoing: {
        Time: (time: sys.type.Time, adds?: MetaAdditions | undefined) => import("@euglena/particle").Particle<"Time", sys.type.Time, MetaAdditions>;
        ACK: (adds?: MetaAdditions | undefined) => import("@euglena/particle").Particle<"ACK", undefined, MetaAdditions>;
    };
}>;
export default _default;
