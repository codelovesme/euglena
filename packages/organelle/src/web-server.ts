import { CommonParticles, domc, P } from "@euglena/core";

const webServer = {
    v1: domc<{
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
    }>(["GetAlive"], ["ACK", "Exception", "Impulse", "Log"])
};

export { webServer as netServer };
