import { Particle } from "../types";
import { defineCreateParticleMap } from "./define-create-particle-map";

export type ACK = Particle<"ACK">;
export type NACK = Particle<"NACK">;
export type Log = Particle<"Log", { message: string; level: "Error" | "Info" | "Warning" }>;

export type CommonParticles = ACK | NACK | Log;

export const createCommonParticles = defineCreateParticleMap<CommonParticles>(["ACK", "NACK", "Log"]);
export const ccp = createCommonParticles;