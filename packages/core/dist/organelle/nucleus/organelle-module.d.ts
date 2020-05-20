import { sys } from "cessnalib";
import { Particle } from "../..";
import { Gene } from "./gene.h";
declare const _default: import("..").OrganelleModule<import("..").InsertSapIntoParticles<{
    incoming: {
        ReceiveParticle: import("..").P<{
            particle: Particle<string, any, {
                [x: string]: any;
            }>;
            source: string;
        }, {}>;
    };
    outgoing: {
        Log: import("..").P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
        Exception: import("..").P<sys.type.Exception, {}>;
        ACK: import("..").P<undefined, {}>;
    };
}, import("..").P<{
    path: string;
    type: "FileSystemPath" | "NodeModules" | "Url";
} | {
    genes: Gene<Particle<string, any, {
        [x: string]: any;
    }>>[];
    type: "InMemory";
}, {
    organelleName: string;
}>>>;
export default _default;
