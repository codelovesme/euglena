export interface MetaAdditions {
    [P: string]: string | number | boolean;
}

export type Meta<Class extends string = string, Additions extends MetaAdditions = {}> = Additions & {
    class: Class;
};

export interface Particle<Class extends string = string, Data = any, Additions extends MetaAdditions = {}> {
    meta: Meta<Class, Additions>;
    data: Data;
}

export type getMeta<P extends Particle> = P["meta"];

export type getClass<P extends Particle> = getMeta<P>["class"];

export type changeClass<P extends Particle, class_ extends string> = {
    meta: { [Prop in keyof getMeta<P>]: Prop extends "class" ? class_ : getMeta<P>[Prop] };
    data: P["data"];
};