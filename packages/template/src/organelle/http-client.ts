import { AllInteractions, Particle, cp as _cp, ComingParticles, CreateParticleUnion } from "@euglena/core";
import { sys } from "cessnalib";
import { common } from "../particle";

import Headers = sys.type.Headers;

export type Get = Particle<
    "Get",
    {
        url: string;
        headers?: Headers;
    }
>;

export type Post = Particle<
    "Post",
    {
        url: string;
        headers?: Headers;
        body: any;
    }
>;

export type Put = Particle<
    "Put",
    {
        url: string;
        headers?: Headers;
        body: any;
    }
>;

export type Delete = Particle<
    "Delete",
    {
        url: string;
        headers?: Headers;
    }
>;

export type Response = Particle<
    "Response",
    {
        headers?: Headers;
        body: any;
        status: number;
    }
>;

export type HttpClient = AllInteractions<{
    in: [[Get, Response], [Post, Response], [Put, Response], [Delete, Response]];
    out: [common.Log];
}>;

export const createParticle = _cp as CreateParticleUnion<ComingParticles<HttpClient>>;
export const cp = createParticle;
