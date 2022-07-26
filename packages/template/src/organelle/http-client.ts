import { P, FromP, domc } from "@euglena/core";
import { CommonParticles } from "../particle/particles.h";
import { Headers } from "./utils";

type PResponse = P<{
    headers?: Headers;
    body: any;
    status: number;
}>;

const httpClient = {
    v1: domc<{
        in: {
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
        out: {
            ACK: CommonParticles["ACK"];
            Exception: CommonParticles["Exception"];
            Log: CommonParticles["Log"];
            Response: PResponse;
        };
    }>(["Get", "Post", "Put", "Delete"], ["Log", "ACK", "Exception", "Response"])
};

type Response = FromP<"Response", PResponse>;

export { httpClient, Response };
