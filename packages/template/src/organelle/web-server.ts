import { sys } from "cessnalib";
import { particle, organelle } from "@euglena/core";
import { common } from "../particle";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import CreateParticleUnion = particle.CreateParticleUnion;
import Headers = sys.type.Headers;

export type AddRoute = particle.Particle<
    "AddRoute",
    {
        method: "get" | "post" | "put" | "delete";
        path: string;
        queryParams?: string[];
    }
>;

export type WebServerImpulse = particle.Particle<
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

export type WebServer = extendOrganelleInteractions<{
    in: [common.GetAlive, AddRoute];
    out: [[WebServerImpulse, common.Particles], common.Log];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<WebServer>>;
export const cp = createParticle;
