import { type } from "cessnalib";
import { Particle } from "@euglena/core";

import Headers = type.Headers;

export type HttpImpulse = Particle<
    "WebServerImpulse",
    {
        path: string;
        method: "get" | "post" | "put" | "delete";
        queryParams: object;
        pathParams: object;
        headers?: Headers;
        body: object;
    }
>;