import { domc } from "../../organelle/define-organelle-module-create";
import { P, FromP } from "../../organelle/particles.h";
import { CommonParticles } from "../particle/particles.h";
import { Headers } from "./utils";

type PResponse = P<{
    headers?: Headers;
    body: any;
    status: number;
}>;

const httpClient = {
    v1: domc<{
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
    }>(["Get", "Post", "Put", "Delete"], ["Log", "ACK", "Exception", "Response"])
};

type Response = FromP<"Response", PResponse>;

export { httpClient, Response };
