declare type HttpHeaderUnion = "a-im" | "accept" | "accept-charset" | "accept-encoding" | "accept-language" | "accept-datetime" | "access-control-request-method" | "access-control-request-headers" | "authorization" | "cache-control" | "connection" | "content-length" | "content-type" | "cookie" | "date" | "expect" | "forwarded" | "from" | "host" | "if-match" | "if-modified-since" | "if-none-match" | "if-range" | "if-unmodified-since" | "max-forwards" | "origin" | "pragma" | "proxy-authorization" | "range" | "referer" | "te" | "user-agent" | "upgrade" | "via" | "Warning";
declare type Headers = {
    [key in HttpHeaderUnion]?: string;
};
export { HttpHeaderUnion, Headers };
