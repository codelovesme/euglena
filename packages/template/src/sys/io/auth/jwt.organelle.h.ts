import { organelle } from "@euglena/core";
import { GenerateToken } from "./generate-token.particle.h";
import { DecryptedToken } from "./decrypted-token.particle.h";
import { EncryptedToken } from "./encrypted-token.particle.h";
import { VerifyToken } from "./verify-token.particle.h";
import { Exception } from "../exception";

export type JWT = organelle.extendOrganelleInteractions<{
    in: [[GenerateToken, EncryptedToken], [VerifyToken, DecryptedToken | Exception]];
    out: [];
}>;