import { AllInteractions, Particle } from "@euglena/core";
import { sys } from "cessnalib";
import { Log } from "../particle/common.h";

import Headers = sys.type.Headers;

export type Namespace = "HttpClient";

export type Get = Particle<
    "Get",
    {
        url: string;
        headers?: Headers;
    },
    { namespace: Namespace }
>;

export type Post = Particle<
    "Post",
    {
        url: string;
        headers?: Headers;
        body: any;
    },
    { namespace: Namespace }
>;

export type Put = Particle<
    "Put",
    {
        url: string;
        headers?: Headers;
        body: any;
    },
    { namespace: Namespace }
>;

export type Delete = Particle<
    "Delete",
    {
        url: string;
        headers?: Headers;
    },
    { namespace: Namespace }
>;

export type Response = Particle<
    "Response",
    {
        headers?: Headers;
        body: any;
        status: number;
    },
    { namespace: Namespace }
>;

export type HttpClient = AllInteractions<{
    in: [[Get, Response], [Post, Response], [Put, Response], [Delete, Response]];
    out: [Log];
}>;
