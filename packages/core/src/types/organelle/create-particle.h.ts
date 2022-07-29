import { Particle } from "../particle.h";

export type CreateParticle<P extends Particle<string, any>> = P["data"] extends undefined
    ? {} extends Omit<P["meta"], "class">
        ? (class_: P["meta"]["class"]) => P
        : (class_: P["meta"]["class"], adds: Omit<P["meta"], "class">) => P
    : {} extends Omit<P["meta"], "class">
    ? (class_: P["meta"]["class"], data: P["data"]) => P
    : (class_: P["meta"]["class"], data: P["data"], adds: Omit<P["meta"], "class">) => P;

export type CreateParticleWithoutClass<P extends Particle<string, any>> = P["data"] extends undefined
    ? {} extends Omit<P["meta"], "class">
        ? () => P
        : (adds: Omit<P["meta"], "class">) => P
    : {} extends Omit<P["meta"], "class">
    ? (data: P["data"]) => P
    : (data: P["data"], adds: Omit<P["meta"], "class">) => P;

export type DefineCreateParticleWithoutClass<P extends Particle<string, any>> = (
    class_: P["meta"]["class"]
) => CreateParticleWithoutClass<P>;
