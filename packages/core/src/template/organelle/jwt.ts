import { domc, FromP, P } from "../../organelle";
import { CommonParticles } from "../particle/particles.h";

export type PGenerateToken = P<CommonParticles["DecryptedToken"]["data"]>;
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
            DecryptedToken: CommonParticles["DecryptedToken"];
            EncryptedToken: CommonParticles["EncryptedToken"];
            Exception: CommonParticles["Exception"];
        };
    }>(["GenerateToken", "VerifyToken"], ["DecryptedToken", "Exception", "EncryptedToken"])
};

export { jwt };
