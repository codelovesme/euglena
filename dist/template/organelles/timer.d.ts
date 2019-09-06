import { sys } from "cessnalib";
import { MetaAdditions } from "../../core/particle.h";
export declare const timer: import("../..").OrganelleModule<"Timer", {
    incoming: {
        TimerReadTime: (adds?: MetaAdditions | undefined) => import("../../core/particle.h").Particle<"TimerReadTime", undefined, {}>;
        TimerSap: (time: sys.type.Time, adds?: MetaAdditions | undefined) => import("../../core/particle.h").Particle<"TimerSap", sys.type.Time, {}>;
        TimerSetTime: (time: sys.type.Time, adds?: MetaAdditions | undefined) => import("../../core/particle.h").Particle<"TimerSetTime", sys.type.Time, {}>;
    };
    outgoing: {
        TimerTime: (time: sys.type.Time, adds?: MetaAdditions | undefined) => import("../../core/particle.h").Particle<"TimerTime", sys.type.Time, {}>;
        ACK: (adds?: MetaAdditions | undefined) => import("../../core/particle.h").Particle<"ACK", unknown, {}>;
    };
}>;
