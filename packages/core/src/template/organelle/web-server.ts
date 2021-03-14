import { CommonParticles } from "..";
import { domc } from "../../organelle/define-organelle-module-create";
import { P, FromP } from "../../organelle/particles.h";
import { Headers } from "./utils";

type PAddRoute = P<{
    method: "get" | "post" | "put" | "delete";
    path: string;
    queryParams?: string[];
}>;

type AddRoute = FromP<"AddRoute", PAddRoute>;

type PWebServerImpulse = P<{
    path: string;
    method: string;
    queryParams: object;
    pathParams: object;
    headers?: Headers;
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
