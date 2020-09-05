import { CommonParticles } from "../../common";
import { domc } from "../define-organelle-module-create";
import { P, FromP } from "../particles.h";

type PAddRoute = P<{
    method: "get" | "post" | "put" | "delete";
    path: string;
    queryParams?: string[];
    pathParams?: string[];
}>;

type AddRoute = FromP<"AddRoute", PAddRoute>;

type PWebServerImpulse = P<{
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
type WebServerImpulse = FromP<"WebServerImpulse", PWebServerImpulse>;

const webServer = {
    v1: domc<{
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
    }>(["GetAlive", "AddRoute"], ["ACK", "Exception", "WebServerImpulse", "Log"])
};

export { webServer, AddRoute, PAddRoute, WebServerImpulse };
