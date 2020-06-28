import { P, FromP } from "../particles.h";
declare type HttpHeaderUnion = "A-IM" | "Accept" | "Accept-Charset" | "Accept-Encoding" | "Accept-Language" | "Accept-Datetime" | "Access-Control-Request-Method" | "Access-Control-Request-Headers" | "Authorization" | "Cache-Control" | "Connection" | "Content-Length" | "Content-Type" | "Cookie" | "Date" | "Expect" | "Forwarded" | "From" | "Host" | "If-Match" | "If-Modified-Since" | "If-None-Match" | "If-Range" | "If-Unmodified-Since" | "Max-Forwards" | "Origin" | "Pragma" | "Proxy-Authorization" | "Range" | "Referer" | "TE" | "User-Agent" | "Upgrade" | "Via" | "Warning";
declare type Headers = {
    [key in HttpHeaderUnion]?: string;
};
declare type PResponse = P<{
    headers: Headers;
    body: any;
    status: number;
}>;
declare const httpClient: {
    v1: import("..").CreateOrganelleModuleInterface<{
        incoming: {
            Get: P<{
                url: string;
                headers?: Headers | undefined;
            }, {}>;
            Post: P<{
                url: string;
                headers?: Headers | undefined;
                body: any;
            }, {}>;
            Delete: P<{
                url: string;
                headers?: Headers | undefined;
            }, {}>;
        };
        outgoing: {
            ACK: P<undefined, {}>;
            Exception: P<import("cessnalib").sys.type.Exception, {}>;
            Log: P<{
                message: string;
                level: "Error" | "Info" | "Warning";
            }, {}>;
            Response: P<{
                headers: Headers;
                body: any;
                status: number;
            }, {}>;
        };
    }, undefined>;
};
declare type Response = FromP<"Response", PResponse>;
export { httpClient, Response };
