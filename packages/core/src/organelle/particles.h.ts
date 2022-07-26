import { Particle, MetaAdditions } from "../particle";

export type P<Data = any, Adds extends MetaAdditions = {}> = {
    data: Data;
    adds: Adds;
};

export type FromP<Class extends string, R extends P> = Particle<Class, R["data"], R["adds"]>;

//@ts-ignore
export type ToP<Par extends Particle> = P<Par["data"], Omit<Par["meta"], "class">>;

export type Sap<
    Data = any,
    Adds extends MetaAdditions & { organelleName: string } = {
        organelleName: string;
    }
> = P<Data, Adds>;