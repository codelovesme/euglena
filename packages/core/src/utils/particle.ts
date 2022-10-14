import { FindParticle, Meta, MetaAdditions, Particle } from "../types";

export function createMeta<Class extends string, Additions extends MetaAdditions = {}>(
    class_: Class,
    adds?: Additions
): Meta<Class, Additions> {
    return {
        class: class_,
        ...adds
    } as Meta<Class, Additions>;
}

export function createParticle<P extends Particle>(
    class_: P["meta"]["class"],
    data?: P["data"],
    adds?: Omit<P["meta"], "class">
): P {
    return {
        meta: createMeta(class_, adds as any),
        data
    } as P;
}

export function assertNotParticle(particle: never, message: string): void {
    throw message || `Assertion fails: ${particle} is a particle where it shouldn't be`;
}

export function isParticle(x: any): x is Particle {
    return typeof x === "object" && typeof x.meta === "object" && typeof x.meta.class === "string";
}

export function isParticleClass<ParticleUnion extends Particle, Class extends ParticleUnion["meta"]["class"]>(
    particle: ParticleUnion,
    class_: Class
): particle is FindParticle<ParticleUnion, Class> {
    return particle.meta.class === class_;
}

/**
 * createParticle
 */
export const cp = createParticle;
/**
 * createMeta
 */
export const cm = createMeta;
