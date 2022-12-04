import { particle } from "@euglena/core";
import { DecryptedToken } from "../../organelle/jwt";

export type Session = particle.Particle<
    "Session",
    {
        encryptedToken: string;
        decryptedToken: DecryptedToken["data"];
    }
>;