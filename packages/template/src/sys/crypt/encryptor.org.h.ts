import { Compare } from "./compare.par.h";
import { createOrganelleInteractions } from "@euglena/core";
import { Encrypt } from "./encrypt.par.h";
import { Hash } from "./hash.par.h";
import { Decrypt } from "./decrypt.par.h";
import { Boolean, Exception } from "../../type";
import { Plain } from "./plain.par.h";

export type Encryptor = createOrganelleInteractions<{
    in: [[Encrypt, Hash], [Decrypt, Plain | Exception], [Compare, Boolean | Exception]];
    out: [];
}>;

