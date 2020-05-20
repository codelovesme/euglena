import { P } from "@euglena/core";
declare const webServer: {
    v1: import("@euglena/core").CreateOrganelleModuleInterface<{
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
    }>;
};
export { webServer as netServer };
