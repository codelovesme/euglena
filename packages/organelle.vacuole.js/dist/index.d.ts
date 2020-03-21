import { Particle } from "@euglena/core";
declare const _default: import("@euglena/core").OrganelleModule<"Vacuole", import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        SaveParticle: import("@euglena/core").P<{
            particle: Particle<string, any, {
                [x: string]: any;
            }>;
            query?: import("cessnalib").sys.type.RecursivePartial<Particle<string, any, {
                [x: string]: any;
            }>> | undefined;
            count: import("@euglena/core").Count;
        } | Particle<string, any, {
            [x: string]: any;
        }>[], {}>;
        ReadParticle: import("@euglena/core").P<{
            query: import("cessnalib").sys.type.RecursivePartial<Particle<string, any, {
                [x: string]: any;
            }>>;
            count: import("@euglena/core").Count;
        }, {}>;
        RemoveParticle: import("@euglena/core").P<{
            query: import("cessnalib").sys.type.RecursivePartial<Particle<string, any, {
                [x: string]: any;
            }>>;
            count: import("@euglena/core").Count;
        }, {}>;
        GetAlive: import("@euglena/core").P<undefined, {}>;
        Hibernate: import("@euglena/core").P<undefined, {}>;
    };
    outgoing: {
        ACK: import("@euglena/core").P<undefined, {}>;
        Exception: import("@euglena/core").P<import("cessnalib").sys.type.Exception, {}>;
        Particles: import("@euglena/core").P<Particle<string, any, {
            [x: string]: any;
        }>[], {}>;
        Metas: import("@euglena/core").P<{
            class: string;
            createdAt: number;
            expireAt?: number | undefined;
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
    particles: Particle<string, any, {
        [x: string]: any;
    }>[];
    type: "InMemory";
}, {
    organelle: {
        name: string;
        nick?: string | undefined;
    };
}>>>;
export default _default;