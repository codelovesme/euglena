import { Particle } from "../..";
import { P } from "..";
declare const _default: import("..").CreateOrganelleModuleInterface<{
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
export default _default;
