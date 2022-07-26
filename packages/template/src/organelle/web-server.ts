import { domc, FromP, P } from "@euglena/core";
import { GetAlive, Log } from "../particle";
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
        in: [[GetAlive], [AddRoute]];
        out: [[WebServerImpulse], [Log]];
    }>()
};

export { webServer, AddRoute, PAddRoute, WebServerImpulse };
