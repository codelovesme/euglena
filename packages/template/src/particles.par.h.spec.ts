import { ts } from "cessnalib";
import { cp } from "@euglena/core";
import { Particles } from "./particles.par.h";
import { getParticle } from "./particles.par.u";
import { ACK } from "./ack.par.h";

const particles = cp<Particles>("Particles", []);

const p = getParticle<ACK>(particles, "ACK");

(): true => true as ts.test.AssertTrue<ts.test.Equals<Exclude<typeof p, undefined>, ACK>>;
