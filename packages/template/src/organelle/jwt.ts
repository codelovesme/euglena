import { AllInteractions, Particle } from "@euglena/core";

export type Namespace = "Jwt";

export type DecryptedToken = Particle<
    "DecryptedToken",
    {
        euglenaName: string;
        createdAt: number;
        expireAt: number;
        type: string;
        roles: string[];
        status: "Active" | "Deactive" | "NeedsVerification";
    },
    { version: "2.0"; namespace: Namespace }
>;
export type EncryptedToken = Particle<"EncryptedToken", string, { namespace: Namespace }>;
export type GenerateToken = Particle<
    "GenerateToken",
    DecryptedToken["data"],
    { version: "2.0"; namespace: Namespace }
>;
export type VerifyToken = Particle<"VerifyToken", string, { namespace: Namespace }>;

export type JWT = AllInteractions<{
    in: [[GenerateToken, EncryptedToken], [VerifyToken, DecryptedToken]];
    out: [];
}>;
