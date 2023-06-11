import { Log } from "../../../log";
import { ReadFile } from "./read-file.par.h";
import { FileContent } from "./file-content.par.h";
import { WriteFile } from "./write-file.par.h";
import { createOrganelleInteractions } from "@euglena/core";
import { ACK, Exception } from "../../../../type";

export type FS = createOrganelleInteractions<{
    in: [[ReadFile, FileContent | Exception], [WriteFile, Exception | ACK]];
    out: [Log, ACK];
    
}>;
