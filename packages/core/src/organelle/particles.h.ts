import { Particle, MetaAdditions } from "../particle";

export type P<Data = any, Adds extends MetaAdditions = {}> = {
    data: Data;
    adds: Adds;
};

export type FromP<Class extends string, R extends P> = Particle<Class, R["data"], R["adds"]>;

export type Sap<
    Data = any,
    Adds extends MetaAdditions & { organelleName: string } = {
        organelleName: string;
    }
> = P<Data, Adds>;

export type OrganelleParticles<T1 extends { [x: string]: P } = { [x: string]: P }> = T1;

export type AllOrganelleParticles<
    T1 extends { [x: string]: P } = { [x: string]: P },
    T2 extends { [x: string]: P } = { [x: string]: P }
> = {
    incoming: OrganelleParticles<T1>;
    outgoing: OrganelleParticles<T2>;
};

export type CreateOrganelleParticles<T extends OrganelleParticles> = {
    [P in Exclude<keyof T, number | symbol>]: T[P]["adds"] extends { [x: string]: undefined }
        ? T[P]["data"] extends undefined
            ? () => Particle<P, undefined>
            : (data: T[P]["data"]) => Particle<P, T[P]["data"]>
        : <M extends T[P]["adds"]>(data: T[P]["data"], adds: M) => Particle<P, T[P]["data"], M>;
};

export type CreateAllOrganelleParticles<T extends AllOrganelleParticles> = {
    incoming: CreateOrganelleParticles<T["incoming"]>;
    outgoing: CreateOrganelleParticles<T["outgoing"]>;
};

export type ParticleNameUnion<CP extends OrganelleParticles> = Exclude<keyof CP, number | symbol>;

export type InComingParticleNameUnion<COP extends AllOrganelleParticles> = ParticleNameUnion<COP["incoming"]>;
export type OutGoingParticleNameUnion<COP extends AllOrganelleParticles> = ParticleNameUnion<COP["outgoing"]>;

export type InComingParticle<
    COP extends AllOrganelleParticles,
    N extends InComingParticleNameUnion<COP> = InComingParticleNameUnion<COP>
> = {
    [P in N]: Particle<P, COP["incoming"][P]["data"], COP["incoming"][P]["adds"]>;
}[N];
export type OutGoingParticle<
    COP extends AllOrganelleParticles,
    N extends OutGoingParticleNameUnion<COP> = OutGoingParticleNameUnion<COP>
> = {
    [P in N]: Particle<P, COP["outgoing"][P]["data"], COP["outgoing"][P]["adds"]>;
}[N];

export type InsertSapIntoParticles<COP extends AllOrganelleParticles, S extends P> = {
    incoming: COP["incoming"] & {
        ["Sap"]: S;
    };
    outgoing: COP["outgoing"];
};
