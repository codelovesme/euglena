import { sys } from "cessnalib";
import { Particle } from "../../../particle";
import { Gene } from "./gene.h";
import { P } from "../../particles.h";
declare const nucleusJs: import("../..").SingletonOrganelleModule<import("../../particles.h").InsertSingletonSapIntoParticles<{
    incoming: {
        ReceiveParticle: P<{
            particle: Particle<string, any, {
                [x: string]: any;
            }>;
            source: string;
        }, {}>;
    };
    outgoing: {
        Log: P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
        Exception: P<sys.type.Exception, {}>;
        ACK: P<undefined, {}>;
    };
}, P<{
    path: string;
    type: "FileSystemPath" | "NodeModules" | "Url";
} | {
    genes: Gene<Particle<string, any, {
        [x: string]: any;
    }>>[];
    type: "InMemory";
}, {}>>>;
export { nucleusJs };
