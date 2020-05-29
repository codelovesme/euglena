import { Particle } from "../../particle";
import { P } from "../particles.h";
declare const netClient: {
    v1: import("..").CreateOrganelleModuleInterface<{
        incoming: {
            TransmitParticle: P<{
                particle: Particle<string, any, {
                    [x: string]: any;
                }>;
                target: {
                    host: string;
                    port: number;
                };
            }, {}>;
        };
        outgoing: {
            ACK: P<undefined, {}>;
            Exception: P<import("cessnalib").sys.type.Exception, {}>;
            Log: P<{
                message: string;
                level: "Error" | "Info" | "Warning";
            }, {}>;
        };
    }, undefined>;
};
export { netClient };
