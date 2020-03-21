import { MetaAdditions, CreateParticle, CreateMeta, Meta, Particle } from "./particle.h";

export const createMeta: CreateMeta = <ClassType extends string, M extends MetaAdditions>(
    _class: ClassType,
    adds?: M
): Meta<ClassType, M> =>
    ({
        class: _class,
        createdAt: new Date().getTime(),
        ...adds
    } as Meta<ClassType, M>);

export const createParticle: CreateParticle = <ClassType extends string, DataType, M extends MetaAdditions>(
    _class: ClassType,
    data: DataType,
    adds?: M
): Particle<ClassType, DataType, M> => {
    return { meta: createMeta(_class, adds), data };
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
 * Alias for createParticle
 */
export const cp = createParticle;
/**
 * Alias for createMeta
 */
export const cm = createMeta;
