import { getParticle } from "./particles";
import { Particles } from "./particles.h";
import { ACK } from "../ack.h";
import { AssertTrue, Equals } from "@euglena/core";

const particles = {} as Particles;

const particle = getParticle<ACK>(particles, "ACK");

(): true => true as AssertTrue<Equals<Exclude<typeof particle, undefined>, ACK>>;
