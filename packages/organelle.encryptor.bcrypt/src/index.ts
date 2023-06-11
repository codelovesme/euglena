import { cp, dco } from "@euglena/core";
import { cell, sys, type } from "@euglena/template";
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
        return cp<type.Exception>("Exception", {
            message: "Not supported!",
        });
    },
    Compare: async ({ data: { plain, hash } }) => {
        return cp<type.Boolean>("Boolean", await compare(plain.data, hash.data));
    }
});
