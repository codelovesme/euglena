import { OrganelleReceive, OrganelleModule, P } from "..";
import { Particle } from "../../particle";
declare const _default: OrganelleModule<"EndoplasmicReticulum", import("..").InsertSapIntoParticles<{
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
                organelle: OrganelleModule<string, import("..").AllOrganelleParticles<{
                    [x: string]: P<any, {}>;
                }, {
                    [x: string]: P<any, {}>;
                }>>;
            };
            nick?: string | undefined;
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
}, {
    organelle: {
        name: string;
        nick?: string | undefined;
    };
}>>>;
export default _default;
