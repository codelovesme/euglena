declare const vacuole: {
    v1: import("..").CreateOrganelleModuleInterface<{
        incoming: {
            SaveParticle: import("..").P<{
                particle: import("../..").Particle<string, any, {
                    [x: string]: any;
                }>;
                query?: import("cessnalib").sys.type.RecursivePartial<import("../..").Particle<string, any, {
                    [x: string]: any;
                }>> | undefined;
                count: number | "all";
            } | import("../..").Particle<string, any, {
                [x: string]: any;
            }>[], {}>;
            ReadParticle: import("..").P<{
                query: import("cessnalib").sys.type.RecursivePartial<import("../..").Particle<string, any, {
                    [x: string]: any;
                }>>;
                count: number | "all";
            }, {}>;
            RemoveParticle: import("..").P<{
                query: import("cessnalib").sys.type.RecursivePartial<import("../..").Particle<string, any, {
                    [x: string]: any;
                }>>;
                count: number | "all";
            }, {}>;
            GetAlive: import("..").P<undefined, {}>;
            Hibernate: import("..").P<undefined, {}>;
        };
        outgoing: {
            ACK: import("..").P<undefined, {}>;
            Exception: import("..").P<import("cessnalib").sys.type.Exception, {}>;
            Particles: import("..").P<import("../..").Particle<string, any, {
                [x: string]: any;
            }>[], {}>;
            Metas: import("..").P<{
                class: string;
                createdAt: number;
                expireAt?: number | undefined;
            }[], {}>;
            Log: import("..").P<{
                message: string;
                level: "Error" | "Info" | "Warning";
            }, {}>;
        };
    }, undefined>;
};
export { vacuole };
