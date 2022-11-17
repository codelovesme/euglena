import { Particle } from "@euglena/core";
import { DecryptedToken } from "../../organelle/jwt";

export type Session = Particle<
    "Session",
    {
        encryptedToken: string;
        decryptedToken: DecryptedToken["data"];
    }
>;