declare const endoplasmicReticulum: import("..").CreateOrganelleModuleInterface<"EndoplasmicReticulum", {
    incoming: {
        TransmitParticle: import("..").P<{
            target: string;
            particle: import("../..").Particle<string, any, {
                [x: string]: any;
            }>;
        }, {}>;
        OrganelleInfo: import("..").P<{
            name: string;
            location: {
                type: "FileSystemPath" | "NodeModules" | "Url";
                path: string;
            } | {
                type: "InMemory";
                organelle: import("..").OrganelleModule<string, import("..").AllOrganelleParticles<{
                    [x: string]: import("..").P<any, {}>;
                }, {
                    [x: string]: import("..").P<any, {}>;
                }>>;
            };
            nick?: string | undefined;
        }, {}>;
    };
    outgoing: {
        Log: import("..").P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
        TransmitResponse: import("..").P<void | import("../..").Particle<string, any, {
            [x: string]: any;
        }>, {}>;
        EuglenaHasBeenBorn: import("..").P<any, {}>;
    };
}>;
export { endoplasmicReticulum };
