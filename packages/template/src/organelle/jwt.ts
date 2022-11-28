import { particle, organelle } from "@euglena/core";
import { common } from "../particle";

import ComingParticles = organelle.ComingParticles;
import extendOrganelleInteractions = organelle.extendOrganelleInteractions;
import CreateParticleUnion = particle.CreateParticleUnion;

export type DecryptedToken = particle.Particle<
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
export type EncryptedToken = particle.Particle<"EncryptedToken", string>;
export type GenerateToken = particle.Particle<"GenerateToken", DecryptedToken["data"], { version: "2.0"; }>;
export type VerifyToken = particle.Particle<"VerifyToken", string>;

export type JWT = extendOrganelleInteractions<{
    in: [[GenerateToken, EncryptedToken], [VerifyToken, DecryptedToken | common.Exception]];
    out: [];
}>;

export const createParticle = particle.cp as CreateParticleUnion<ComingParticles<JWT>>;
export const cp = createParticle;