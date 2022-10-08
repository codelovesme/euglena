import { AllInteractions, Particle, cp as _cp, ComingParticles, CreateParticleUnion } from "@euglena/core";
import { common } from "../particle";

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
    { version: "2.0"; }
>;
export type EncryptedToken = Particle<"EncryptedToken", string>;
export type GenerateToken = Particle<"GenerateToken", DecryptedToken["data"], { version: "2.0"; }>;
export type VerifyToken = Particle<"VerifyToken", string>;

export type JWT = AllInteractions<{
    in: [[GenerateToken, EncryptedToken], [VerifyToken, DecryptedToken | common.Exception]];
    out: [];
}>;

export const createParticle = _cp as CreateParticleUnion<ComingParticles<JWT>>;
export const cp = createParticle;