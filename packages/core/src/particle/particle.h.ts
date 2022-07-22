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