import { sys } from "cessnalib";
import { sign, verify } from "jsonwebtoken";
import { jwt } from "@euglena/template";
import { dco, Particle } from "@euglena/core";

export type Sap = Particle;

const secret: string = "92f119fe-e5c5-46fc-a8d5-814c17aea307";

const jwtJsonwebtoken = dco<jwt.JWT, Sap>({
    Sap: async () => {},
    GenerateToken: async ({ data }: jwt.GenerateToken, { cp, t }) => {
        return cp.EncryptedToken(
            sign(data, secret, {
                expiresIn: (data.expireAt - data.createdAt) * 1000
            }),
            { namespace: "Jwt" }
        );
    },
    VerifyToken: async ({ data: crypted }, { cp, t }) => {
        try {
            const decrypted = (await verify(crypted, secret)) as DecryptedToken["data"];
            return cp.DecryptedToken(decrypted, { namespace: "Jwt" });
        } catch (e: any) {
            const exception = new sys.type.Exception("Not a valid token.");
            return cp.Exception(exception);
        }
    }
});

export default jwtJsonwebtoken;
