declare const _default: import("@euglena/core").OrganelleModule<import("@euglena/core").P<{
    host: string;
    port: number;
    database: string;
}, {
    organelleName: string;
}>, import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        SaveParticle: import("@euglena/core").P<{
            particle: import("@euglena/core").Particle<string, unknown, {}>;
            query?: import("cessnalib").sys.type.RecursivePartial<import("@euglena/core").Particle<string, unknown, {}>> | undefined;
            count: import("@euglena/core").Count;
        } | import("@euglena/core").Particle<string, unknown, {}>[], {}>;
        ReadParticle: import("@euglena/core").P<{
            query: import("cessnalib").sys.type.RecursivePartial<import("@euglena/core").Particle<string, unknown, {}>>;
            count: import("@euglena/core").Count;
        }, {}>;
        RemoveParticle: import("@euglena/core").P<{
            query: import("cessnalib").sys.type.RecursivePartial<import("@euglena/core").Particle<string, unknown, {}>>;
            count: import("@euglena/core").Count;
        }, {}>;
        GetAlive: import("@euglena/core").P<undefined, {}>;
        Hibernate: import("@euglena/core").P<undefined, {}>;
    };
    outgoing: {
        ACK: import("@euglena/core").P<undefined, {}>;
        Exception: import("@euglena/core").P<import("cessnalib").sys.type.Exception, {}>;
        Particles: import("@euglena/core").P<import("@euglena/core").Particle<string, unknown, {}>[], {}>;
        Metas: import("@euglena/core").P<{
            class: string;
        }[], {}>;
        Log: import("@euglena/core").P<{
            message: string;
            level: "Info" | "Error" | "Warning";
        }, {}>;
    };
}, import("@euglena/core").P<{
    host: string;
    port: number;
    database: string;
}, {
    organelleName: string;
}>>>;
export default _default;
