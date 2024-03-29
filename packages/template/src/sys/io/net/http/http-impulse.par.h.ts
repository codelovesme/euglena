import { sys } from "cessnalib";
import { Particle } from "@euglena/core";

import Headers = sys.Headers;

export type HttpImpulse = Particle<
    "HttpImpulse",
    {
        path: string;
        method: "get" | "post" | "put" | "delete";
        queryParams: Record<string,string>;
        pathParams: Record<string,string>;
        headers: Headers;
        body: object;
    }
>;