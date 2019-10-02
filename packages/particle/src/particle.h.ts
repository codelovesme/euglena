export interface MetaAdditions {
    [key: string]: unknown;
    expireTime?: number;
}

export type Meta<NameType extends string = string, Additions extends MetaAdditions = {}> = Additions & {
    id: string;
    name: NameType;
    createTime: number;
    expireTime?: number;
};

export interface Particle<NameType extends string = string, DataType = unknown, Additions extends MetaAdditions = {}> {
    meta: Meta<NameType, Additions>;
    data: DataType;
}

export interface CreateMeta {
    <NameType extends string, M extends MetaAdditions>(name: NameType, adds?: M): Meta<NameType, M>;
}

export interface CreateParticle {
    <NameType extends string, DataType, M extends MetaAdditions>(name: NameType, data: DataType, adds?: M): Particle<
        NameType,
        DataType,
        M
    >;
}

export type ParticleNames<T extends { [x: string]: string } = { [x: string]: string }> = { [P in keyof T]: T[P] };

export type Particles<
    P extends ParticleNames = ParticleNames,
    Y extends { [T in keyof P]: Particle<P[T]> } = { [T in keyof P]: Particle<P[T]> }
> = { [T in keyof P]: Y[T] };

export interface CreateSpecificParticle<P extends string = string, T extends Particle<P> = Particle<P>> {
    (name: P, ...remains: unknown[]): T;
}
