import { cp, dco } from "@euglena/core";
import { cell, sys, type } from "@euglena/template";
import { sign, verify } from "jsonwebtoken";
import * as cessnalib from "cessnalib";

const secret: string = "92f119fe-e5c5-46fc-a8d5-814c17aea307";

const jwtJsonwebtoken = dco<sys.crypt.Encryptor, cell.organelle.Sap>({
    Sap: async () => { },
    Encrypt: async ({ data }) => {
        return cp<sys.crypt.Hash>(
            "Hash",
            sign(data, secret, {
                expiresIn: (data.expireAt - data.createdAt) * 1000
            })
        );
    },
    Compare: async () => {
        const exception = new cessnalib.type.Exception("Not supported!");
        return cp<type.Exception>("Exception", exception)
    },
    Decrypt: async ({ data: crypted }) => {
        try {
            const decrypted = (await verify(crypted, secret));
            return cp<sys.crypt.Plain>("Plain", decrypted, { version: "2.0" });
        } catch (e: any) {
            const exception = new cessnalib.type.Exception("Not a valid token.");
            return cp<type.Exception>("Exception", exception);
        }
    }
});

export default jwtJsonwebtoken;
