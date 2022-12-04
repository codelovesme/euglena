import { sys } from "cessnalib";
import { sign, verify } from "jsonwebtoken";
import { organelle, particle } from "@euglena/template";
import * as core from "@euglena/core";

import jwt = organelle.jwt;
import common = particle.common;

const cp = core.particle.cp;
const dco = core.organelle.dco;

export type Sap = particle.common.Sap;

const secret: string = "92f119fe-e5c5-46fc-a8d5-814c17aea307";

const jwtJsonwebtoken = dco<jwt.JWT, Sap>({
    Sap: async () => {},
    GenerateToken: async ({ data }: jwt.GenerateToken, { t }) => {
        return cp<jwt.EncryptedToken>(
            "EncryptedToken",
            sign(data, secret, {
                expiresIn: (data.expireAt - data.createdAt) * 1000
            })
        );
    },
    VerifyToken: async ({ data: crypted }, { t }) => {
        try {
            const decrypted = (await verify(crypted, secret)) as jwt.DecryptedToken["data"];
            return cp<jwt.DecryptedToken>("DecryptedToken", decrypted, { version: "2.0" });
        } catch (e: any) {
            const exception = new sys.type.Exception("Not a valid token.");
            return common.cp("Exception", exception);
        }
    }
});

export default jwtJsonwebtoken;
