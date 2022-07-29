import { Meta, MetaAdditions, Particle } from "../types";

export function createMeta<Class extends string, Additions extends MetaAdditions = {}>(
    class_: Class,
    adds?: Additions
): Meta<Class, Additions> {
    return {
        class: class_,
        ...adds
    } as Meta<Class, Additions>;
}

export function createParticle<Class extends string, Data, Additions extends MetaAdditions = {}>(
    class_: Class,
    data?: Data,
    adds?: Additions
): Particle<Class, Data, Additions> {
    return {
        meta: createMeta(class_, adds),
        data
    } as Particle<Class, Data, Additions>;
}

export function assertNotParticle(particle: never, message: string): void {
    throw message || `Assertion fails: ${particle} is a particle where it shouldn't be`;
}

export function isParticle(x: any): x is Particle {
    return (
        typeof x === "object" && typeof x.meta === "object" && typeof x.meta.class === "string"
        // typeof x.meta.createdAt === "number" &&
        // "data" in x
    );
}

export function isParticleClass<Class extends string>(particle: Particle, class_: Class): particle is Particle<Class> {
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
