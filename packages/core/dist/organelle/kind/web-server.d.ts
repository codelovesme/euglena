import { P } from "../particles.h";
declare const webServer: {
    v1: import("..").CreateOrganelleModuleInterface<{
        incoming: {
            GetAlive: P<undefined, {}>;
        };
        outgoing: {
            ACK: P<undefined, {}>;
            Exception: P<import("cessnalib").sys.type.Exception, {}>;
            Impulse: P<{
                route: string;
                user?: {
                    id: string;
                    roles: string;
                } | undefined;
            }, {}>;
            Log: P<{
                message: string;
                level: "Error" | "Info" | "Warning";
            }, {}>;
        };
    }, undefined>;
};
export { webServer };
