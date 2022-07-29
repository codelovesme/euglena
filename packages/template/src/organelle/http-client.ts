import { AllInteractions, Log, Particle } from "@euglena/core";
import { Headers } from "./utils";

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

export type Response = Particle<
    "Response",
    {
        headers?: Headers;
        body: any;
        status: number;
    }
>;

export type HttpClient = AllInteractions<{
    in: [[Get, Response], [Post, Response], [Put, Response]];
    out: [Log];
}>;
