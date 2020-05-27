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

export interface OrganelleReceive<
    InComingParticle extends Particle = Particle,
    OutGoingParticle extends Particle = Particle
> {
    (particle: InComingParticle): Promise<OutGoingParticle | void>;
}

export type CreateOrganelle<
    InComingParticle extends Particle = Particle,
    OutGoingParticle extends Particle = Particle
> = <OrganelleName extends string>(params: {
    name: OrganelleName;
    transmit: (sourceOrganelle: string, particle: Particle, targetOrganelle?: string) => Promise<Particle | void>;
}) => OrganelleReceive<InComingParticle, OutGoingParticle>;

export type CreateSingletonOrganelle<
    InComingParticle extends Particle = Particle,
    OutGoingParticle extends Particle = Particle
> = (params: {
    transmit: (sourceOrganelle: string, particle: Particle, targetOrganelle?: string) => Promise<Particle | void>;
}) => OrganelleReceive<InComingParticle, OutGoingParticle>;

export type CreateEndoplasmicReticulum<
    InComingParticle extends Particle = Particle,
    OutGoingParticle extends Particle = Particle
> = () => OrganelleReceive<InComingParticle, OutGoingParticle>;

export interface OrganelleModule<COP extends AllOrganelleParticles = AllOrganelleParticles> {
    /**
     * createOrganelle
     */
    co: CreateOrganelle<InComingParticle<COP>, OutGoingParticle<COP>>;
    /**
     * createParticles
     */
    cp: CreateAllOrganelleParticles<COP>;
}

export interface SingletonOrganelleModule<COP extends AllOrganelleParticles = AllOrganelleParticles> {
    /**
     * createOrganelle
     */
    co: CreateSingletonOrganelle<InComingParticle<COP>, OutGoingParticle<COP>>;
    /**
     * createParticles
     */
    cp: CreateAllOrganelleParticles<COP>;
}

export interface EndoplasmicReticulumModule<COP extends AllOrganelleParticles = AllOrganelleParticles> {
    /**
     * createOrganelle
     */
    co: CreateEndoplasmicReticulum<InComingParticle<COP>, OutGoingParticle<COP>>;
    /**
     * createParticles
     */
    cp: CreateAllOrganelleParticles<COP>;
}

export interface CreateOrganelleModule {
    <COP extends AllOrganelleParticles>(
        createParticles: CreateAllOrganelleParticles<COP>,
        bindReactions: BindOrganelleReactions<COP>
    ): OrganelleModule<COP>;
    <COP extends AllOrganelleParticles>(
        createParticles: CreateAllOrganelleParticles<COP>,
        bindReactions: BindOrganelleReactions<COP>,
        organelleName: "EndoplasmicReticulum"
    ): EndoplasmicReticulumModule<COP>;
    <OrganelleName extends string, COP extends AllOrganelleParticles>(
        createParticles: CreateAllOrganelleParticles<COP>,
        bindReactions: BindOrganelleReactions<COP>,
        organelleName: OrganelleName
    ): SingletonOrganelleModule<COP>;
}

export type InsertSapIntoParticles<COP extends AllOrganelleParticles, S extends Sap> = {
    incoming: COP["incoming"] & {
        ["Sap"]: S;
    };
    outgoing: COP["outgoing"];
};

export type InsertSingletonSapIntoParticles<COP extends AllOrganelleParticles, S extends P> = {
    incoming: COP["incoming"] & {
        ["Sap"]: S;
    };
    outgoing: COP["outgoing"];
};

export type BindSingletonOrganelleReactions<
    OrganelleName extends "EndoplasmicReticulum" | "Nucleus",
    COP extends AllOrganelleParticles,
    S extends P
> = OrganelleName extends "EndoplasmicReticulum"
    ? BindReticulumReactions<InsertSingletonSapIntoParticles<COP, S>>
    : BindNucleusReactions<InsertSingletonSapIntoParticles<COP, S>>;

export interface CreateOrganelleModuleInterface<
    COP extends AllOrganelleParticles,
    OrganelleName extends "EndoplasmicReticulum" | "Nucleus" | undefined = undefined
> {
    /**
     * createOrganelleModule
     */
    com: OrganelleName extends "Nucleus" | "EndoplasmicReticulum"
        ? OrganelleName extends "EndoplasmicReticulum"
            ? <S extends P>(
                  bindReactions: BindSingletonOrganelleReactions<OrganelleName, COP, S>
              ) => EndoplasmicReticulumModule<InsertSingletonSapIntoParticles<COP, S>>
            : <S extends P>(
                  bindReactions: BindSingletonOrganelleReactions<OrganelleName, COP, S>
              ) => SingletonOrganelleModule<InsertSingletonSapIntoParticles<COP, S>>
        : <S extends Sap>(
              bindReactions: BindOrganelleReactions<InsertSapIntoParticles<COP, S>>
          ) => OrganelleModule<InsertSapIntoParticles<COP, S>>;
    /**
     * createParticles
     */
    cp: CreateAllOrganelleParticles<COP>;
}

export interface DefineOrganelleModuleCreate {
    <COP extends AllOrganelleParticles>(
        incomingParticleNames: InComingParticleNameUnion<COP>[],
        outgoingParticleNames: OutGoingParticleNameUnion<COP>[]
    ): CreateOrganelleModuleInterface<COP>;
    <COP extends AllOrganelleParticles, OrganelleName extends "EndoplasmicReticulum" | "Nucleus">(
        incomingParticleNames: InComingParticleNameUnion<COP>[],
        outgoingParticleNames: OutGoingParticleNameUnion<COP>[],
        organelleName: OrganelleName
    ): CreateOrganelleModuleInterface<COP, OrganelleName>;
}

export type BindOrganelleReactions<COP extends AllOrganelleParticles> = {
    [P in InComingParticleNameUnion<COP>]: OrganelleReaction<COP, P>;
};

export type BindNucleusReactions<COP extends AllOrganelleParticles> = {
    [P in InComingParticleNameUnion<COP>]: NucleusReaction<COP, P>;
};

export type BindReticulumReactions<COP extends AllOrganelleParticles> = {
    [P in InComingParticleNameUnion<COP>]: EndoplasmicReticulumReaction<COP, P>;
};

export interface OrganelleTransmit<P extends Particle = Particle, Resp extends Particle | void = Particle | void> {
    (particle: P): Promise<Resp>;
}

export interface NucleusTransmit<P extends Particle = Particle, Resp extends Particle | void = Particle | void> {
    (particle: P, targetOrganelle: string): Promise<Resp>;
}

export interface OrganelleReaction<COP extends AllOrganelleParticles, IPNU extends InComingParticleNameUnion<COP>> {
    (
        particle: InComingParticle<COP, IPNU>,
        tools: {
            /**
             * transmit
             */
            t: OrganelleTransmit<OutGoingParticle<COP>>;
            /**
             * createParticle
             */
            cp: CreateOrganelleParticles<COP["outgoing"]>;
        }
    ): Promise<OutGoingParticle<COP> | void>;
}

export interface NucleusReaction<COP extends AllOrganelleParticles, IPNU extends InComingParticleNameUnion<COP>> {
    (
        particle: InComingParticle<COP, IPNU>,
        tools: {
            /**
             * transmit
             */
            t: NucleusTransmit<OutGoingParticle<COP>>;
            /**
             * createParticle
             */
            cp: CreateOrganelleParticles<COP["outgoing"]>;
        }
    ): Promise<OutGoingParticle<COP> | void>;
}

export interface EndoplasmicReticulumReaction<
    COP extends AllOrganelleParticles,
    IPNU extends InComingParticleNameUnion<COP>
> {
    (
        particle: InComingParticle<COP, IPNU>,
        tools: {
            /**
             * createParticle
             */
            cp: CreateOrganelleParticles<COP["outgoing"]>;
        }
    ): Promise<OutGoingParticle<COP> | void>;
}
