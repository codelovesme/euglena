import { AllInteractions, Particle, cp as _cp, ComingParticles, CreateParticleUnion } from "@euglena/core";
import { common } from "../particle";
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
    in: [common.GetAlive, AddRoute];
    out: [[WebServerImpulse, common.Particles], common.Log];
}>;

export const createParticle = _cp as CreateParticleUnion<ComingParticles<WebServer>>;
export const cp = createParticle;
