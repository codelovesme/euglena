import { sys } from "cessnalib";
import { particle, organelle } from "@euglena/core";
import { common } from "../particle";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import CreateParticleUnion = particle.CreateParticleUnion;
import Headers = sys.type.Headers;

export type Get = particle.Particle<
    "Get",
    {
        url: string;
        headers?: Headers;
    }
>;

export type Post = particle.Particle<
    "Post",
    {
        url: string;
        headers?: Headers;
        body: any;
    }
>;

export type Put = particle.Particle<
    "Put",
    {
        url: string;
        headers?: Headers;
        body: any;
    }
>;

export type Delete = particle.Particle<
    "Delete",
    {
        url: string;
        headers?: Headers;
    }
>;

export type Response = particle.Particle<
    "Response",
    {
        headers?: Headers;
        body: any;
        status: number;
    }
>;

export type HttpClient = extendOrganelleInteractions<{
    in: [[Get, Response], [Post, Response], [Put, Response], [Delete, Response]];
    out: [common.Log];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<HttpClient>>;
export const cp = createParticle;
