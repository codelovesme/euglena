import { Log } from "../../../../log";
import { ReadFile } from "./read-file.par.h";
import { FileContent } from "./file-content.par.h";
import { WriteFile } from "./write-file.par.h";
import { createOrganelleInteractions } from "@euglena/core";
import { Exception } from "../../../../exception.par.h";
import { ACK } from "../../../../ack.par.h";
export type FS = createOrganelleInteractions<{
    in: [[ReadFile, FileContent | Exception], [WriteFile, Exception | ACK]];
    out: [Log, ACK];
}>;
//# sourceMappingURL=fs.org.h.d.ts.map