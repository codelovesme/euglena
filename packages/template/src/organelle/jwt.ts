import { AllInteractions, Particle } from "@euglena/core";

export type DecryptedTokenV2 = Particle<
    "DecryptedTokenV2",
    {
        euglenaName: string;
        createdAt: number;
        expireAt: number;
        type: string;
        roles: string[];
        status: "Active" | "Deactive" | "NeedsVerification";
    }
>;
export type EncryptedToken = Particle<"EncryptedToken", string>;
export type GenerateTokenV2 = Particle<"GenerateTokenV2", DecryptedTokenV2["data"]>;
export type VerifyToken = Particle<"VerifyToken", string>;

export type JWT = AllInteractions<{
    in: [[GenerateTokenV2, EncryptedToken], [VerifyToken, DecryptedTokenV2]];
    out: [];
}>;
