import { createOrganelleInteractions } from "@euglena/core";
import { Compare } from "./compare.par.h";
import { Encrypt } from "./encrypt.par.h";
import { Hash } from "./hash.par.h";
import { Decrypt } from "./decrypt.par.h";
import { Plain } from "./plain.par.h";
import { Exception } from "../../exception.par.h";
import { Boolean } from "../../boolean.par.h";

export type Encryptor = createOrganelleInteractions<{
    in: [[Encrypt, Hash], [Decrypt, Plain | Exception], [Compare, Boolean | Exception]];
    out: [];
}>;

