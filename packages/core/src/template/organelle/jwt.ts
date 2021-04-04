import { domc, FromP, P } from "../../organelle";
import { CommonParticles } from "..";

export type PGenerateToken = P<CommonParticles["Token"]["data"]["decrypted"]>;
export type PVerifyToken = P<string>;

export type GenerateToken = FromP<"GenerateToken", PGenerateToken>;
export type VerifyToken = FromP<"VerifyToken", PVerifyToken>;

const jwt = {
    v1: domc<{
        incoming: {
            GenerateToken: PGenerateToken;
            VerifyToken: PVerifyToken;
        };
        outgoing: {
            Token: CommonParticles["Token"];
            Exception: CommonParticles["Exception"];
            ACK: CommonParticles["ACK"];
        };
    }>(["VerifyToken", "VerifyToken"], ["Token", "Exception", "ACK"])
};

export { jwt };
