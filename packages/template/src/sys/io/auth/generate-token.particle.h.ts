import { particle } from "@euglena/core";
import { DecryptedToken } from "./decrypted-token.particle.h";

export type GenerateToken = particle.Particle<"GenerateToken", DecryptedToken["data"], { version: "2.0" }>;
