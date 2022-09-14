import { ts } from "cessnalib";
import { CreateParticleWithoutClass, FindParticle, Particle } from "../types";
import { cp } from "./particle";

export const defineCreateParticleMap = <ParticleUnion extends Particle>(
    particleNames: ts.TupleUnionFromUnion<ParticleUnion["meta"]["class"]>
): { [P in ParticleUnion["meta"]["class"]]: CreateParticleWithoutClass<FindParticle<ParticleUnion, P>> } =>
    particleNames.reduce(
        (acc, curr) => ({
            ...acc,
            [curr]: (...params: any[]) => cp(curr, ...params)
        }),
        {} as any
    );
