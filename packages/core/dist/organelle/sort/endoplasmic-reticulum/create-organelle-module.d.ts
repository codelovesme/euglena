declare const endoplasmicReticulum: import("../..").CreateOrganelleModuleInterface<{
    incoming: {
        TransmitParticle: import("../..").P<{
            target: string;
            particle: import("../../..").Particle<string, any, {
                [x: string]: any;
            }>;
        }, {}>;
        OrganelleInfo: import("../..").P<{
            name: string;
            location: {
                type: "FileSystemPath" | "NodeModules" | "Url";
                path: string;
            } | {
                type: "InMemory";
                organelle: import("../..").OrganelleModule<import("../..").P<any, {
                    organelleName: string;
                }>, any>;
            };
        }, {}>;
    };
    outgoing: {
        Log: import("../..").P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
        TransmitResponse: import("../..").P<void | import("../../..").Particle<string, any, {
            [x: string]: any;
        }>, {}>;
        EuglenaHasBeenBorn: import("../..").P<any, {}>;
    };
}, "EndoplasmicReticulum">;
export { endoplasmicReticulum };
