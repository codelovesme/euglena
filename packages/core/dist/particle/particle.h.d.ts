export interface MetaAdditions {
    [P: string]: string | number;
}
export declare type Meta<Class extends string = string, Additions extends MetaAdditions = {}> = Additions & {
    class: Class;
};
export interface Particle<Class extends string = string, Data = unknown, Additions extends MetaAdditions = {}> {
    meta: Meta<Class, Additions>;
    data: Data;
}
export declare type CreateMeta = <Class extends string, Additions extends MetaAdditions = {}>(class_: Class, adds?: Additions) => Meta<Class, Additions>;
export declare type CreateParticle = <Class extends string, Data, Additions extends MetaAdditions = {}>(class_: Class, data?: Data, adds?: Additions) => Particle<Class, Data, Additions>;
export declare type IsParticleClass = <Class extends string>(particle: Particle, class_: Class) => particle is Particle<Class>;
