import { sys } from "cessnalib";
import { Particle } from "../types";
import { defineCreateParticleMap } from "./define-create-particle-map";

export type ACK = Particle<"ACK">;
export type NACK = Particle<"NACK">;
export type Exception = Particle<"Exception", sys.type.Exception>;
export type Log = Particle<"Log", { message: string; level: "Error" | "Info" | "Warning" }>;

export type CommonParticles = ACK | NACK | Exception | Log;

export const createCommonParticles = defineCreateParticleMap<CommonParticles>(["ACK", "NACK", "Exception", "Log"]);
export const ccp = createCommonParticles;