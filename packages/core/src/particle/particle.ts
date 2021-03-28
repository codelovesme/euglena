import { CreateMeta, CreateParticle, Meta, MetaAdditions, Particle } from "./particle.h";

export const createMeta: CreateMeta = <Class extends string, Additions extends MetaAdditions = {}>(
    class_: Class,
    adds?: Additions
): Meta<Class, Additions> => {
    return {
        class: class_,
        ...adds
    } as Meta<Class, Additions>;
};

export const createParticle: CreateParticle = <Class extends string, Data, Additions extends MetaAdditions = {}>(
    class_: Class,
    data?: Data,
    adds?: Additions
): Particle<Class, Data, Additions> => {
    return {
        meta: createMeta(class_, adds),
        data
    } as Particle<Class, Data, Additions>;
};

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

/**
 * createParticle
 */
export const cp = createParticle;
/**
 * createMeta
 */
export const cm = createMeta;
