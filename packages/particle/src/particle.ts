import { v4 as uuid } from "uuid";
import { MetaAdditions, CreateParticle, CreateMeta, Meta, Particle } from "./particle.h";

export const createMeta: CreateMeta = <NameType extends string, M extends MetaAdditions>(
    name: NameType,
    adds?: M
): Meta<NameType, M> =>
    ({
        id: uuid(),
        name: name,
        createTime: new Date().getTime(),
        ...adds
    } as Meta<NameType, M>);

export const createParticle: CreateParticle = <NameType extends string, DataType, M extends MetaAdditions>(
    name: NameType,
    data: DataType,
    adds?: M
): Particle<NameType, DataType, M> => {
    return { meta: createMeta(name, adds), data };
};

export function assertNotParticle(particle: never, message: string): void {
    throw message || `Assertion fails: ${particle} is a particle where it shouldn't be`;
}

/**
 * Alias for createParticle
 */
export const cp = createParticle;
/**
 * Alias for createMeta
 */
export const cm = createMeta;
