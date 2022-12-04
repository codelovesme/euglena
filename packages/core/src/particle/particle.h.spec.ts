import {ts} from "cessnalib";
import { findParticle, Particle } from "./particle.h";

type result = findParticle<Particle<"abc", boolean> | Particle<"def">, "abc">;

export type Result = [ts.test.AssertTrue<ts.test.Equals<result, Particle<"abc", boolean>>>];
