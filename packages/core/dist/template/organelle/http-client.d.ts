import { P, FromP } from "../../organelle/particles.h";
import { CommonParticles } from "..";
import { Headers } from "./utils";
declare type PResponse = P<{
    headers?: Headers;
    body: any;
    status: number;
}>;
declare const httpClient: {
    v1: import("../..").CreateOrganelleModuleInterface<{
        incoming: {
            Get: P<{
                url: string;
                headers?: Headers;
            }>;
            Post: P<{
                url: string;
                headers?: Headers;
                body: any;
            }>;
            Put: P<{
                url: string;
                headers?: Headers;
                body: any;
            }>;
            Delete: P<{
                url: string;
                headers?: Headers;
            }>;
        };
        outgoing: {
            ACK: CommonParticles["ACK"];
            Exception: CommonParticles["Exception"];
            Log: CommonParticles["Log"];
            Response: PResponse;
        };
    }, undefined>;
};
declare type Response = FromP<"Response", PResponse>;
export { httpClient, Response };
