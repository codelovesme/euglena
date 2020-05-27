import { OrganelleReceive, OrganelleModule } from "..";
import { Particle } from "../../particle";
import { P } from "../organelle.h";
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
                organelle: OrganelleModule<import("..").AllOrganelleParticles<{
                    [x: string]: P<any, {}>;
                }, {
                    [x: string]: P<any, {}>;
                }>>;
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
    reticulumReceive: OrganelleReceive<Particle<string, any, {
        [x: string]: any;
    }>, Particle<string, any, {
        [x: string]: any;
    }>>;
}, {}>>>;
export { endoplasmicReticulumJs };
