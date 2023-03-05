import { particle } from "@euglena/core";

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