import { ACK } from "./ack.par.h";
import { Exception } from "./exception.par.h";
import { NACK } from "./nack.par.h";
import { Particles } from "./particles.par.h";

export type TypeParticle = ACK | NACK | Exception | Particles;