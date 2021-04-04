import { GenerateToken, jwt } from "@euglena/core";
import { sys } from "cessnalib";
import { sign, verify } from "jsonwebtoken";

const secret: string = "92f119fe-e5c5-46fc-a8d5-814c17aea307";

export default jwt.v1.com({
    Sap: async () => {},
    GenerateToken: async ({ data }: GenerateToken, { cp, t }) => {
        return cp.Token({
            crypted: sign(data, secret, {
                expiresIn: (data.expireAt - data.createdAt) * 1000
            }),
            decrypted: data
        });
    },
    VerifyToken: async (p, { cp, t }) => {
        try {
            verify(p.data, secret);
            return cp.ACK();
        } catch (e) {
            return cp.Exception(new sys.type.Exception("Not a valid token."));
        }
    }
});
