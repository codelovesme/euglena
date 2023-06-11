import { Particle } from "@euglena/core";

export type Session = Particle<
    "Session",
    {
        encryptedToken: string;
        decryptedToken: {
            euglenaName: string;
            createdAt: number;
            expireAt: number;
            type: string;
            roles: string[];
            status: "Active" | "Deactive" | "NeedsVerification";
        };
    }
>;