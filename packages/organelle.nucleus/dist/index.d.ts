import { Particle } from "@euglena/particle";
declare const _default: import("@euglena/organelle").CreateOrganelleModuleInterface<"Nucleus", {
    incoming: {
        ReceiveParticle: (particle: Particle<string, unknown, {}>, source: string) => Particle<"ReceiveParticle", {
            particle: Particle<string, unknown, {}>;
            source: string;
        }, {}>;
    };
    outgoing: {
        Log: (message: string, level: "Info" | "Error" | "Warning", adds?: import("@euglena/particle").MetaAdditions | undefined) => Particle<"Log", {
            message: string;
            level: "Info" | "Error" | "Warning";
        }, import("@euglena/particle").MetaAdditions>;
        Exception: (message: string, innerException?: import("cessnalib").sys.type.Exception | undefined, adds?: import("@euglena/particle").MetaAdditions | undefined) => Particle<"Exception", import("cessnalib").sys.type.Exception, import("@euglena/particle").MetaAdditions>;
        ACK: (adds?: import("@euglena/particle").MetaAdditions | undefined) => Particle<"ACK", undefined, import("@euglena/particle").MetaAdditions>;
    };
}>;
export default _default;
