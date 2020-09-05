import { CommonParticles } from "../../common";
import { P, FromP } from "../particles.h";
declare type PAddRoute = P<{
    method: "get" | "post" | "put" | "delete";
    path: string;
    queryParams?: string[];
    pathParams?: string[];
}>;
declare type AddRoute = FromP<"AddRoute", PAddRoute>;
declare type PWebServerImpulse = P<{
    route: string;
    path: string;
    method: string;
    queryParams: object;
    pathParams: object;
    user?: {
        id: string;
        roles: string;
    };
    body: object;
}>;
declare type WebServerImpulse = FromP<"WebServerImpulse", PWebServerImpulse>;
declare const webServer: {
    v1: import("..").CreateOrganelleModuleInterface<{
        incoming: {
            GetAlive: CommonParticles["GetAlive"];
            AddRoute: PAddRoute;
        };
        outgoing: {
            ACK: CommonParticles["ACK"];
            Exception: CommonParticles["Exception"];
            WebServerImpulse: PWebServerImpulse;
            Log: CommonParticles["Log"];
        };
    }, undefined>;
};
export { webServer, AddRoute, PAddRoute, WebServerImpulse };
