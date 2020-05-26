declare const vacuole: {
    v1: import("./organelle.h").CreateOrganelleModuleInterface<{
        incoming: {
            SaveParticle: import("./organelle.h").P<{
                particle: import("..").Particle<string, any, {
                    [x: string]: any;
                }>;
                query?: import("cessnalib").sys.type.RecursivePartial<import("..").Particle<string, any, {
                    [x: string]: any;
                }>> | undefined;
                count: number | "all";
            } | import("..").Particle<string, any, {
                [x: string]: any;
            }>[], {}>;
            ReadParticle: import("./organelle.h").P<{
                query: import("cessnalib").sys.type.RecursivePartial<import("..").Particle<string, any, {
                    [x: string]: any;
                }>>;
                count: number | "all";
            }, {}>;
            RemoveParticle: import("./organelle.h").P<{
                query: import("cessnalib").sys.type.RecursivePartial<import("..").Particle<string, any, {
                    [x: string]: any;
                }>>;
                count: number | "all";
            }, {}>;
            GetAlive: import("./organelle.h").P<undefined, {}>;
            Hibernate: import("./organelle.h").P<undefined, {}>;
        };
        outgoing: {
            ACK: import("./organelle.h").P<undefined, {}>;
            Exception: import("./organelle.h").P<import("cessnalib").sys.type.Exception, {}>;
            Particles: import("./organelle.h").P<import("..").Particle<string, any, {
                [x: string]: any;
            }>[], {}>;
            Metas: import("./organelle.h").P<{
                class: string;
                createdAt: number;
                expireAt?: number | undefined;
            }[], {}>;
            Log: import("./organelle.h").P<{
                message: string;
                level: "Error" | "Info" | "Warning";
            }, {}>;
        };
    }>;
};
export { vacuole };
