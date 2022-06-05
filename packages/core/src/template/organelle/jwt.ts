import { domc, FromP, P } from "../../organelle";
import { CommonParticles } from "../particle/particles.h";

export type PGenerateToken = CommonParticles["DecryptedToken"];
export type PGenerateTokenV2 = CommonParticles["DecryptedTokenV2"];
export type PVerifyToken = P<string>;

export type GenerateToken = FromP<"GenerateToken", PGenerateToken>;
export type GenerateTokenV2 = FromP<"GenerateToken", PGenerateTokenV2>;
export type VerifyToken = FromP<"VerifyToken", PVerifyToken>;

const jwt = {
    v1: domc<{
        incoming: {
            GenerateToken: PGenerateToken;
            VerifyToken: PVerifyToken;
        };
        outgoing: {
            DecryptedToken: CommonParticles["DecryptedToken"];
            EncryptedToken: CommonParticles["EncryptedToken"];
            Exception: CommonParticles["Exception"];
        };
    }>(["GenerateToken", "VerifyToken"], ["DecryptedToken", "Exception", "EncryptedToken"]),
    v2: domc<{
        incoming: {
            GenerateToken: PGenerateTokenV2;
            VerifyToken: PVerifyToken;
        };
        outgoing: {
            DecryptedToken: CommonParticles["DecryptedToken"];
            EncryptedToken: CommonParticles["EncryptedToken"];
            Exception: CommonParticles["Exception"];
        };
    }>(["GenerateToken", "VerifyToken"], ["DecryptedToken", "Exception", "EncryptedToken"])
};

export { jwt };
