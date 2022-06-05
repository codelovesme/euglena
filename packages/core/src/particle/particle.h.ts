export interface MetaAdditions {
    [P: string]: string | number | boolean;
}

export type Meta<Class extends string = string, Additions extends MetaAdditions = {}> = Additions & {
    class: Class;
};

export interface Particle<Class extends string = string, Data = unknown, Additions extends MetaAdditions = {}> {
    meta: Meta<Class, Additions>;
    data: Data;
}

export type CreateMeta = <Class extends string, Additions extends MetaAdditions = {}>(
    class_: Class,
    adds?: Additions
) => Meta<Class, Additions>;

export type CreateParticle = <Class extends string, Data, Additions extends MetaAdditions = {}>(
    class_: Class,
    data?: Data,
    adds?: Additions
) => Particle<Class, Data, Additions>;

export type IsParticleClass = <Class extends string>(particle: Particle, class_: Class) => particle is Particle<Class>;
