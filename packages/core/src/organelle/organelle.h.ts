import { Particle, MetaAdditions } from "../particle";

export type P<Data = any, Adds extends MetaAdditions = {}> = {
    data: Data;
    adds: Adds;
};

export type FromP<Class extends string, R extends P> = Particle<Class, R["data"], R["adds"]>;

export type Sap<
    Data = any,
    Adds extends MetaAdditions & { organelle: { name: string; nick?: string } } = {
        organelle: { name: string; nick?: string };
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
> = (
    transmit?: (sourceOrganelle: string, particle: Particle, targetOrganelle?: string) => Promise<Particle | void>
) => OrganelleReceive<InComingParticle, OutGoingParticle>;

export interface OrganelleModule<
    OrganelleName extends string = string,
    COP extends AllOrganelleParticles = AllOrganelleParticles
> {
    name: OrganelleName;
    /**
     * Alias for name
     */
    n: OrganelleName;

    createOrganelle: CreateOrganelle<InComingParticle<COP>, OutGoingParticle<COP>>;
    /**
     * Alias for CreateOrganelle
     */
    co: CreateOrganelle<InComingParticle<COP>, OutGoingParticle<COP>>;

    createParticles: CreateAllOrganelleParticles<COP>;
    /**
     * Alias for CreateParticles
     */
    cp: CreateAllOrganelleParticles<COP>;
}

export interface CreateOrganelleModule {
    <OrganelleName extends string, COP extends AllOrganelleParticles>(
        name: OrganelleName,
        createParticles: CreateAllOrganelleParticles<COP>,
        bindReactions: BindReactions<COP, OrganelleName>
    ): OrganelleModule<OrganelleName, COP>;
}

export type InsertSapIntoParticles<COP extends AllOrganelleParticles, S extends Sap> = {
    incoming: COP["incoming"] & {
        ["Sap"]: S;
    };
    outgoing: COP["outgoing"];
};

export interface CreateOrganelleModuleInterface<OrganelleName extends string, COP extends AllOrganelleParticles> {
    name: OrganelleName;
    /**
     * Alias for name
     */
    n: OrganelleName;

    createOrganelleModule: <S extends Sap>(
        bindReactions: OrganelleName extends "EndoplasmicReticulum"
            ? BindReactionsER<InsertSapIntoParticles<COP, S>>
            : BindReactions<InsertSapIntoParticles<COP, S>, OrganelleName>
    ) => OrganelleModule<OrganelleName, InsertSapIntoParticles<COP, S>>;
    /**
     * Alias for createOrganelleModule
     */
    com: <S extends Sap>(
        bindReactions: OrganelleName extends "EndoplasmicReticulum"
            ? BindReactionsER<InsertSapIntoParticles<COP, S>>
            : BindReactions<InsertSapIntoParticles<COP, S>, OrganelleName>
    ) => OrganelleModule<OrganelleName, InsertSapIntoParticles<COP, S>>;
    createParticles: CreateAllOrganelleParticles<COP>;
    /**
     * Alias for createParticles
     */
    cp: CreateAllOrganelleParticles<COP>;
}

export interface DefineOrganelleModuleCreate {
    <OrganelleName extends string>(name: OrganelleName): <COP extends AllOrganelleParticles>(
        incomingParticleNames: InComingParticleNameUnion<COP>[],
        outgoingParticleNames: OutGoingParticleNameUnion<COP>[]
    ) => CreateOrganelleModuleInterface<OrganelleName, COP>;
}

export type BindReactions<COP extends AllOrganelleParticles, OrganelleName extends string> = {
    [P in InComingParticleNameUnion<COP>]: OrganelleReaction<COP, P, OrganelleName>;
};

export type BindReactionsER<COP extends AllOrganelleParticles> = {
    [P in InComingParticleNameUnion<COP>]: EndoplasmicReticulumReaction<COP, P>;
};

export interface OrganelleTransmit<P extends Particle = Particle, Resp extends Particle | void = Particle | void> {
    (particle: P): Promise<Resp>;
}

export interface NucleusTransmit<P extends Particle = Particle, Resp extends Particle | void = Particle | void> {
    (particle: P, targetOrganelle: string): Promise<Resp>;
}

export interface OrganelleReaction<
    COP extends AllOrganelleParticles,
    IPNU extends InComingParticleNameUnion<COP>,
    OrganelleName extends string
> {
    (
        particle: InComingParticle<COP, IPNU>,
        tools: {
            transmit: OrganelleName extends "Nucleus"
                ? NucleusTransmit<OutGoingParticle<COP>>
                : OrganelleTransmit<OutGoingParticle<COP>>;
            /**
             * Alias for receive
             */
            t: OrganelleName extends "Nucleus"
                ? NucleusTransmit<OutGoingParticle<COP>>
                : OrganelleTransmit<OutGoingParticle<COP>>;
            createParticle: CreateOrganelleParticles<COP["outgoing"]>;
            /**
             * Alias for createParticle
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
            createParticle: CreateOrganelleParticles<COP["outgoing"]>;
            /**
             * Alias for createParticle
             */
            cp: CreateOrganelleParticles<COP["outgoing"]>;
        }
    ): Promise<OutGoingParticle<COP> | void>;
}
