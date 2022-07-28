import { AllInteractions, Particle } from "@euglena/core";
import { GetAlive, Log } from "../particle";
import { Headers } from "./utils";

export type AddRoute = Particle<
    "AddRoute",
    {
        method: "get" | "post" | "put" | "delete";
        path: string;
        queryParams?: string[];
    }
>;

export type WebServerImpulse = Particle<"WebServerImpulse", {
    path: string;
    method: string;
    queryParams: object;
    pathParams: object;
    headers?: Headers;
    body: object;
}>;

export type WebServer = AllInteractions<{
    in: [[GetAlive], [AddRoute]];
    out: [[WebServerImpulse], [Log]];
}>;
