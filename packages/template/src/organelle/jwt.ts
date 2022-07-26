import { domc, FromP, P } from "@euglena/core";
import { CommonParticles } from "../particle/particles.h";

export type PGenerateToken = CommonParticles["DecryptedToken"];
export type PGenerateTokenV2 = CommonParticles["DecryptedTokenV2"];
export type PVerifyToken = P<string>;

export type GenerateToken = FromP<"GenerateToken", PGenerateToken>;
export type GenerateTokenV2 = FromP<"GenerateToken", PGenerateTokenV2>;
export type VerifyToken = FromP<"VerifyToken", PVerifyToken>;

const jwt = {
    v1: domc<{
        in: {
            GenerateToken: PGenerateToken;
            VerifyToken: PVerifyToken;
        };
        out: {
            DecryptedToken: CommonParticles["DecryptedToken"];
            EncryptedToken: CommonParticles["EncryptedToken"];
            Exception: CommonParticles["Exception"];
        };
    }>(["GenerateToken", "VerifyToken"], ["DecryptedToken", "Exception", "EncryptedToken"]),
    v2: domc<{
        in: {
            GenerateToken: PGenerateTokenV2;
            VerifyToken: PVerifyToken;
        };
        out: {
            DecryptedToken: CommonParticles["DecryptedToken"];
            EncryptedToken: CommonParticles["EncryptedToken"];
            Exception: CommonParticles["Exception"];
        };
    }>(["GenerateToken", "VerifyToken"], ["DecryptedToken", "Exception", "EncryptedToken"])
};

export { jwt };
