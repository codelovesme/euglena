export interface MetaAdditions {
    [key: string]: any;
}

export type Meta<ClassType extends string = string, Additions extends MetaAdditions = {}> = Additions & {
    class: ClassType;
    createdAt: number;
    expireAt?: number;
};

export interface Particle<
    ClassType extends string = string,
    DataType = any,
    Additions extends MetaAdditions = { [x: string]: any }
> {
    meta: Meta<ClassType, Additions>;
    data: DataType;
}

export interface CreateMeta {
    <ClassType extends string, M extends MetaAdditions>(_class: ClassType, adds?: M): Meta<ClassType, M>;
}

export interface CreateParticle {
    <ClassType extends string, DataType, M extends MetaAdditions>(
        _class: ClassType,
        data: DataType,
        adds?: M
    ): Particle<ClassType, DataType, M>;
}

export type ParticleClass<T extends { [x: string]: string } = { [x: string]: string }> = { [P in keyof T]: T[P] };

export interface CreateSpecificParticle<P extends string = string, T extends Particle<P> = Particle<P>> {
    (_class: P, ...remains: any[]): T;
}
