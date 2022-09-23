import { Particle } from "@euglena/core";
import { sys } from "cessnalib";

export type Particles = Particle<"Particles", Particle[]>;

export type GetAlive = Particle<"GetAlive">;

export type Exception = Particle<"Exception", sys.type.Exception>;
