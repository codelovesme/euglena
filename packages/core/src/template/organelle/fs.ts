import { PLog, PException, PACK } from "..";
import { P } from "../../organelle/particles.h";
import { domc } from "../../organelle/define-organelle-module-create";

type Encoding = "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex";

const fs = {
    v1: domc<{
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
    }>(["WriteFile", "ReadFile"], ["ACK", "Log", "Exception", "FileContent"])
};

export { fs };
