import { Particle } from "@euglena/particle";
import { sys } from "cessnalib";
declare const _default: import("@euglena/organelle").OrganelleModule<"Nucleus", import("@euglena/organelle").InsertSapIntoParticles<{
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
        Exception: (message: string, innerException?: sys.type.Exception | undefined, adds?: import("@euglena/particle").MetaAdditions | undefined) => Particle<"Exception", sys.type.Exception, import("@euglena/particle").MetaAdditions>;
        ACK: (adds?: import("@euglena/particle").MetaAdditions | undefined) => Particle<"ACK", undefined, import("@euglena/particle").MetaAdditions>;
    };
}, {
    path: string;
    type: "FileSystemPath" | "NodeModules" | "Url";
}>>;
export default _default;
