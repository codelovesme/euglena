import { Particle } from "@euglena/core";
declare const _default: import("@euglena/core").OrganelleModule<import("@euglena/core").P<{
    path: string;
    type: "FileSystemPath" | "NodeModules" | "Url";
} | {
    particles: Particle[];
    type: "InMemory";
}, {
    organelleName: string;
}>, import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        SaveParticle: import("@euglena/core").P<{
            particle: Particle<string, unknown, {}>;
            query?: import("cessnalib").sys.type.RecursivePartial<Particle<string, unknown, {}>> | undefined;
            count: number | "all";
        } | Particle<string, unknown, {}>[], {}>;
        ReadParticle: import("@euglena/core").P<{
            query: import("cessnalib").sys.type.RecursivePartial<Particle<string, unknown, {}>>;
            count: number | "all";
        }, {}>;
        RemoveParticle: import("@euglena/core").P<{
            query: import("cessnalib").sys.type.RecursivePartial<Particle<string, unknown, {}>>;
            count: number | "all";
        }, {}>;
        GetAlive: import("@euglena/core").P<undefined, {}>;
        Hibernate: import("@euglena/core").P<undefined, {}>;
    };
    outgoing: {
        ACK: import("@euglena/core").P<undefined, {}>;
        Exception: import("@euglena/core").P<import("cessnalib").sys.type.Exception, {}>;
        Particles: import("@euglena/core").P<Particle<string, unknown, {}>[], {}>;
        Metas: import("@euglena/core").P<{
            class: string;
        }[], {}>;
        Log: import("@euglena/core").P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
    };
}, import("@euglena/core").P<{
    path: string;
    type: "FileSystemPath" | "NodeModules" | "Url";
} | {
    particles: Particle[];
    type: "InMemory";
}, {
    organelleName: string;
}>>>;
export default _default;
