import { P, FromP } from "../particles.h";
declare type PAddRoute = P<{
    method: "get" | "post" | "put" | "delete";
    path: string;
    queryParams: string[];
    pathParams: string[];
}>;
declare type AddRoute = FromP<"AddRoute", PAddRoute>;
declare const webServer: {
    v1: import("..").CreateOrganelleModuleInterface<{
        incoming: {
            GetAlive: P<undefined, {}>;
            AddRoute: P<{
                method: "get" | "post" | "put" | "delete";
                path: string;
                queryParams: string[];
                pathParams: string[];
            }, {}>;
        };
        outgoing: {
            ACK: P<undefined, {}>;
            Exception: P<import("cessnalib").sys.type.Exception, {}>;
            Impulse: P<{
                route: string;
                path: string;
                method: string;
                queryParams: object;
                pathParams: object;
                user?: {
                    id: string;
                    roles: string;
                } | undefined;
                body: object;
            }, {}>;
            Log: P<{
                message: string;
                level: "Error" | "Info" | "Warning";
            }, {}>;
        };
    }, undefined>;
};
export { webServer, AddRoute, PAddRoute };
