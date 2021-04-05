import { P } from "../../../organelle/particles.h";
import { OrganelleReceive } from "../../../organelle/organelle-receive.h";
import { Particle } from "../../../particle";
import { OrganelleModule } from "../../../organelle/organelle-module.h";
declare const endoplasmicReticulumJs: import("../../../organelle/organelle-module.h").EndoplasmicReticulumModule<P<{
    particles: Particle[];
    reticulumReceive: OrganelleReceive;
}, {}>, import("../../../organelle/particles.h").InsertSapIntoParticles<{
    incoming: {
        TransmitParticle: P<{
            target: string;
            particle: Particle<string, unknown, {}>;
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
        TransmitResponse: P<void | Particle<string, unknown, {}>, {}>;
        EuglenaHasBeenBorn: P<any, {}>;
    };
}, P<{
    particles: Particle[];
    reticulumReceive: OrganelleReceive;
}, {}>>>;
export { endoplasmicReticulumJs };