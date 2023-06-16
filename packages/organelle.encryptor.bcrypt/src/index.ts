import { cp, dco } from "@euglena/core";
import { Exception, Boolean, cell, sys } from "@euglena/template";
import { compare, hash } from "bcrypt";

let saltRounds: string | number;

export type Sap = cell.organelle.Sap<{
    saltRounds: string | number;
}>;

export default dco<sys.crypt.Encryptor, Sap>({
    Sap: async (p) => {
        saltRounds = p.data.saltRounds;
    },
    Encrypt: async ({ data }) => {
        return cp<sys.crypt.Hash>("Hash", await hash(data, saltRounds));
    },
    Decrypt: async () => {
        return cp<Exception>("Exception", {
            message: "Not supported!",
        });
    },
    Compare: async ({ data: { plain, hash } }) => {
        return cp<Boolean>("Boolean", await compare(plain.data, hash.data));
    }
});
