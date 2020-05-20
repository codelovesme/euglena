import { OrganelleReceive, OrganelleModule } from "..";
import { Particle } from "../../particle";
declare const endoplasmicReticulumJs: OrganelleModule<import("..").InsertSapIntoParticles<{
    incoming: {
        TransmitParticle: import("..").P<{
            target: string;
            particle: Particle<string, any, {
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
                organelle: OrganelleModule<import("..").AllOrganelleParticles<{
                    [x: string]: import("..").P<any, {}>;
                }, {
                    [x: string]: import("..").P<any, {}>;
                }>>;
            };
        }, {}>;
    };
    outgoing: {
        Log: import("..").P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
        TransmitResponse: import("..").P<void | Particle<string, any, {
            [x: string]: any;
        }>, {}>;
        EuglenaHasBeenBorn: import("..").P<any, {}>;
    };
}, import("..").P<{
    particles: Particle<string, any, {
        [x: string]: any;
    }>[];
    reticulumReceive: OrganelleReceive<Particle<string, any, {
        [x: string]: any;
    }>, Particle<string, any, {
        [x: string]: any;
    }>>;
}, {
    organelleName: string;
}>>>;
export { endoplasmicReticulumJs };
