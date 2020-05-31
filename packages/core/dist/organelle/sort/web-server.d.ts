import { CommonParticles } from "../../common";
import { P } from "../particles.h";
declare const webServer: {
    v1: import("..").CreateOrganelleModuleInterface<{
        incoming: {
            GetAlive: CommonParticles["GetAlive"];
        };
        outgoing: {
            ACK: CommonParticles["ACK"];
            Exception: CommonParticles["Exception"];
            Impulse: P<{
                route: string;
                user?: {
                    id: string;
                    roles: string;
                };
            }>;
            Log: CommonParticles["Log"];
        };
    }, undefined>;
};
export { webServer };
