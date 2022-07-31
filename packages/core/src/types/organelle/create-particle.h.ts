import { Particle } from "../particle.h";
import { EqualsAny } from "./utils";

export type CreateParticle<P extends Particle> = EqualsAny<P["data"]> extends true
    ? {} extends Omit<P["meta"], "class">
        ? (class_: P["meta"]["class"]) => P
        : (class_: P["meta"]["class"], data: undefined, adds: Omit<P["meta"], "class">) => P
    : {} extends Omit<P["meta"], "class">
    ? (class_: P["meta"]["class"], data: P["data"]) => P
    : (class_: P["meta"]["class"], data: P["data"], adds: Omit<P["meta"], "class">) => P;

export type CreateParticleWithoutClass<P extends Particle> = EqualsAny<P["data"]> extends true
    ? {} extends Omit<P["meta"], "class">
        ? () => P
        : (data: undefined, adds: Omit<P["meta"], "class">) => P
    : {} extends Omit<P["meta"], "class">
    ? (data: P["data"]) => P
    : (data: P["data"], adds: Omit<P["meta"], "class">) => P;

import "./create-particle.h.spec";
