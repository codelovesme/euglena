import { getParticle } from "./particles";
import { Particles } from "./particles.h";
import { ACK } from "../ack.h";
import { particle } from "@euglena/core";
import { ts } from "cessnalib";

const particles = particle.cp<Particles>("Particles", []);

const p = getParticle<ACK>(particles, "ACK");

(): true => true as ts.test.AssertTrue<ts.test.Equals<Exclude<typeof p, undefined>, ACK>>;
