import { AllInteractions, Particle } from "@euglena/core";
import { GetAlive, Log, Particles } from "../particle/common.h";
import { sys } from "cessnalib";

import Headers = sys.type.Headers;

export type AddRoute = Particle<
    "AddRoute",
    {
        method: "get" | "post" | "put" | "delete";
        path: string;
        queryParams?: string[];
    }
>;

export type WebServerImpulse = Particle<
    "WebServerImpulse",
    {
        path: string;
        method: string;
        queryParams: object;
        pathParams: object;
        headers?: Headers;
        body: object;
    }
>;

export type WebServer = AllInteractions<{
    in: [GetAlive, AddRoute];
    out: [[WebServerImpulse, Particles], Log];
}>;
