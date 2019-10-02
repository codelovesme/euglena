import { Particle } from "@euglena/particle";
declare const _default: import("@euglena/organelle").OrganelleModule<"Vacuole", import("@euglena/organelle").InsertSapIntoParticles<{
    incoming: {
        SaveParticle: (particle: Particle<string, unknown, {}>, query?: import("cessnalib").sys.type.RecursivePartial<Particle<string, unknown, {}>> | undefined, count?: number | "all" | undefined, adds?: import("@euglena/particle").MetaAdditions | undefined) => Particle<"SaveParticle", {
            particle: Particle<string, unknown, {}>;
            query: import("cessnalib").sys.type.RecursivePartial<Particle<string, unknown, {}>> | undefined;
            count: import("@euglena/organelle.vacuole").Count;
        }, import("@euglena/particle").MetaAdditions>;
        ReadParticle: (query: import("cessnalib").sys.type.RecursivePartial<Particle<string, unknown, {}>>, count?: number | "all" | undefined, adds?: import("@euglena/particle").MetaAdditions | undefined) => Particle<"ReadParticle", {
            query: import("cessnalib").sys.type.RecursivePartial<Particle<string, unknown, {}>>;
            count: import("@euglena/organelle.vacuole").Count;
        }, import("@euglena/particle").MetaAdditions>;
        RemoveParticle: (query: import("cessnalib").sys.type.RecursivePartial<Particle<string, unknown, {}>>, count?: number | "all" | undefined, adds?: import("@euglena/particle").MetaAdditions | undefined) => Particle<"RemoveParticle", {
            query: import("cessnalib").sys.type.RecursivePartial<Particle<string, unknown, {}>>;
            count: import("@euglena/organelle.vacuole").Count;
        }, import("@euglena/particle").MetaAdditions>;
    };
    outgoing: {
        ACK: (adds?: import("@euglena/particle").MetaAdditions | undefined) => Particle<"ACK", undefined, import("@euglena/particle").MetaAdditions>;
        Exception: (message: string, innerException?: import("cessnalib").sys.type.Exception | undefined, adds?: import("@euglena/particle").MetaAdditions | undefined) => Particle<"Exception", import("cessnalib").sys.type.Exception, import("@euglena/particle").MetaAdditions>;
        Particles: (particlesArray: Particle<string, unknown, {}>[], adds?: import("@euglena/particle").MetaAdditions | undefined) => Particle<"Particles", Particle<string, unknown, {}>[], import("@euglena/particle").MetaAdditions>;
        Metas: (metas: {
            id: string;
            name: string;
            createTime: number;
            expireTime?: number | undefined;
        }[], adds?: import("@euglena/particle").MetaAdditions | undefined) => Particle<"Metas", {
            id: string;
            name: string;
            createTime: number;
            expireTime?: number | undefined;
        }[], import("@euglena/particle").MetaAdditions>;
    };
}, {
    path: string;
    type: "FileSystemPath" | "NodeModules" | "Url";
}>>;
export default _default;
