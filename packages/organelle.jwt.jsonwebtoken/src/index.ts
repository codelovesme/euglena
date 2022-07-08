import { sys } from "cessnalib";
import { sign, verify } from "jsonwebtoken";
import { jwt, GenerateToken, DecryptedToken } from "@euglena/template";
import { Sap } from "@euglena/core";

const secret: string = "92f119fe-e5c5-46fc-a8d5-814c17aea307";

 const jwtJsonwebtoken = jwt.v1.com<Sap>({
    Sap: async () => {},
    GenerateToken: async ({ data }: GenerateToken, { cp, t }) => {
        return cp.EncryptedToken(
            sign(data, secret, {
                expiresIn: (data.expireAt - data.createdAt) * 1000
            })
        );
    },
    VerifyToken: async ({ data: crypted }, { cp, t }) => {
        try {
            const decrypted = (await verify(crypted, secret)) as DecryptedToken["data"];
            return cp.DecryptedToken(decrypted);
        } catch (e: any) {
            const exception = new sys.type.Exception("Not a valid token.");
            return cp.Exception(exception);
        }
    }
});

export default jwtJsonwebtoken;