import { P } from "../../particles.h";
import { OrganelleReceive } from "../../organelle-receive.h";
import { Particle } from "../../../particle";
import { OrganelleModule } from "../../organelle-module.h";
declare const endoplasmicReticulumJs: import("../../organelle-module.h").EndoplasmicReticulumModule<P<{
    particles: Particle[];
    reticulumReceive: OrganelleReceive;
}, {}>, import("../../particles.h").InsertSapIntoParticles<{
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
                organelle: OrganelleModule<P<any, {
                    organelleName: string;
                }>, any>;
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
    particles: Particle[];
    reticulumReceive: OrganelleReceive;
}, {}>>>;
export { endoplasmicReticulumJs };
