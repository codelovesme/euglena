import { PLog, PException, PACK } from "../../common";
import { P } from "../particles.h";
declare type Encoding = "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex";
declare const fs: {
    v1: import("..").CreateOrganelleModuleInterface<{
        incoming: {
            WriteFile: P<{
                filePath: string;
                content: string;
                encoding?: Encoding;
            }>;
            ReadFile: P<{
                filePath: string;
                encoding?: Encoding;
            }>;
        };
        outgoing: {
            Log: PLog;
            Exception: PException;
            ACK: PACK;
            FileContent: P<string>;
        };
    }, undefined>;
};
export { fs };
