import { Particle } from "../../../particle";
import { P } from "../../particles.h";
declare const nucleus: import("../..").CreateOrganelleModuleInterface<{
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
        Exception: P<import("cessnalib").sys.type.Exception, {}>;
        ACK: P<undefined, {}>;
    };
}, "Nucleus">;
export { nucleus };
