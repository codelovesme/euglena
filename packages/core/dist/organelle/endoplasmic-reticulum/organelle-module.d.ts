import { OrganelleModule } from "..";
import { Particle } from "../../particle";
import { P } from "../particles.h";
declare const endoplasmicReticulumJs: import("..").EndoplasmicReticulumModule<import("..").InsertSingletonSapIntoParticles<{
    incoming: {
        TransmitParticle: P<{
            target: string;
            particle: Particle<string, any, {
                [x: string]: any;
            }>;
        }, {}>;
        OrganelleInfo: P<{
            name: string;
            location: {
                type: "FileSystemPath" | "NodeModules" | "Url";
                path: string;
            } | {
                type: "InMemory";
                organelle: OrganelleModule<any>;
            };
        }, {}>;
    };
    outgoing: {
        Log: P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
        TransmitResponse: P<void | Particle<string, any, {
            [x: string]: any;
        }>, {}>;
        EuglenaHasBeenBorn: P<any, {}>;
    };
}, P<{
    particles: Particle<string, any, {
        [x: string]: any;
    }>[];
    reticulumReceive: any;
}, {}>>>;
export { endoplasmicReticulumJs };
