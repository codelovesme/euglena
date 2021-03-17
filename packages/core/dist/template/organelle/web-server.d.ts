import { CommonParticles } from "..";
import { P, FromP } from "../../organelle/particles.h";
import { Headers } from "./utils";
declare type PAddRoute = P<{
    method: "get" | "post" | "put" | "delete";
    path: string;
    queryParams?: string[];
}>;
declare type AddRoute = FromP<"AddRoute", PAddRoute>;
declare type PWebServerImpulse = P<{
    path: string;
    method: string;
    queryParams: object;
    pathParams: object;
    headers?: Headers;
    body: object;
}>;
declare type WebServerImpulse = FromP<"WebServerImpulse", PWebServerImpulse>;
declare const webServer: {
    v1: import("../..").CreateOrganelleModuleInterface<{
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
